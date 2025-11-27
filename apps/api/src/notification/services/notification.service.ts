import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import type { PrismaClient } from '@repo/database';
import { EVENTS } from '@repo/types';

import { NotificationGateway } from '../gateway/notification.gateway';
import { SERVICES } from 'src/utils/constants';
import type { IUserService } from 'src/user/interfaces/user.interface';
import type { IProjectService } from 'src/project/interfaces/project.interface';
import type { ITaskService } from 'src/task/interfaces/task.interface';
import type { INotificationService } from '../interfaces/notification.interface';
import { NotificationPayloadWithIv } from '../types/notification.types';
import { DecryptResponseInterceptor } from 'src/crypto/interceptors/decrypt-reponse.interceptor';

type UserChannel = Subject<NotificationPayloadWithIv>;

interface UserChannelEntry {
  channel: UserChannel;
  subscribers: number;
}

@Injectable()
@UseInterceptors(DecryptResponseInterceptor)
export class NotificationService implements INotificationService {
  constructor(
    @Inject(SERVICES.PRISMA)
    private readonly prismaService: PrismaClient,

    @Inject(SERVICES.USER)
    private readonly userService: IUserService,

    @Inject(SERVICES.TASK)
    private readonly taskService: ITaskService,

    private readonly notificationGateway: NotificationGateway,
  ) {}

  private userChannels = new Map<string, UserChannelEntry>();

  @OnEvent(EVENTS.PROJECT_INVITED)
  public async handleProjectInvited(payload: {
    invitedUserId: string;
    inviterId: string;
    projectName: string;
    projectId: string;
    inviterAlias: string;
  }) {
    await this.prismaService.projectInviteNotification.create({
      data: {
        holderId: payload.invitedUserId,
        inviterId: payload.inviterId,
        projectId: payload.projectId,
      },
    });

    const inviter = await this.userService.findUser(payload.inviterId);
    const project = await this.prismaService.project.findUnique({
      where: {
        id: payload.projectId,
      },
    });

    if (!project) return;

    const notification: NotificationPayloadWithIv = {
      invitedUserId: payload.invitedUserId,
      projectName: payload.projectName,
      projectNameIv: project.nameIv,
      inviterAlias: payload.inviterAlias,
      inviterAliasIv: inviter.aliasIv,
      projectId: payload.projectId,
    };

    this.notificationGateway.sendToUser(
      payload.invitedUserId,
      EVENTS.PROJECT_INVITED,
      notification,
    );
  }

  @OnEvent(EVENTS.TASK_ASSIGNED)
  public async handleTaskAssigned(payload: {
    assignedUserId: string;
    taskId: string;
    assignerId: string;
  }) {
    await this.prismaService.taskAssignedNotification.create({
      data: {
        holderId: payload.assignedUserId,
        inviterId: payload.assignerId,
        taskId: payload.taskId,
      },
    });

    const assigner = await this.userService.findUser(payload.assignerId);
    const task = await this.taskService.findTask(payload.taskId);

    const notification: NotificationPayloadWithIv = {
      assignedUserId: payload.assignedUserId,
      assignerName: assigner.alias,
      assignerNameIv: assigner.aliasIv,
      taskName: task.title,
      taskNameIv: task.titleIv,
    };

    this.notificationGateway.sendToUser(
      payload.assignedUserId,
      EVENTS.TASK_ASSIGNED,
      notification,
    );
  }

  public async checkExistingInvite(
    projectId: string,
    holderId: string,
    inviterId: string,
  ) {
    const notification =
      await this.prismaService.projectInviteNotification.findFirst({
        where: {
          projectId,
          holderId,
          inviterId,
        },
      });

    return notification != null;
  }
}
