import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type {
  PrismaClient,
  ProjectInviteNotification,
  TaskAssignedNotification,
} from '@repo/database';
import {
  AssignNotificationPayload,
  InviteNotificationPayload,
} from '@repo/types';

import { SERVICES } from 'src/utils/constants';
import type { IUserService } from 'src/user/interfaces/user.interface';
import type { ITaskService } from 'src/task/interfaces/task.interface';
import type { INotificationService } from '../interfaces/notification.interface';
import type { NotificationPayloadWithIv } from '../types/notification.types';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @Inject(SERVICES.PRISMA)
    private readonly prismaService: PrismaClient,

    @Inject(SERVICES.USER)
    private readonly userService: IUserService,

    @Inject(SERVICES.TASK)
    private readonly taskService: ITaskService,
  ) {}

  public async createProjectInviteNotification(
    payload: InviteNotificationPayload,
  ): Promise<NotificationPayloadWithIv | null> {
    if (
      await this.checkExistingInvite(
        payload.projectId,
        payload.invitedUserId,
        payload.inviterId,
      )
    ) {
      throw new ConflictException('This invitation is already created');
    }

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

    if (!project) return null;

    const notification: NotificationPayloadWithIv = {
      invitedUserId: payload.invitedUserId,
      projectName: project.name,
      projectNameIv: project.nameIv,
      inviterAlias: inviter.alias,
      inviterAliasIv: inviter.aliasIv,
      projectId: project.id,
    };

    return notification;
  }

  public async createTaskAssignedNotification(
    payload: AssignNotificationPayload,
  ): Promise<NotificationPayloadWithIv> {
    await this.prismaService.taskAssignedNotification.create({
      data: {
        holder: {
          connect: {
            id: payload.assignedUserId,
          },
        },
        inviter: {
          connect: {
            id: payload.assignedUserId,
          },
        },
        task: {
          connect: {
            id: payload.taskId,
          },
        },
      },
    });

    const assigner = await this.userService.findUser(payload.assignerUserId);
    const task = await this.taskService.findTask(payload.taskId);

    const notification: NotificationPayloadWithIv = {
      assignedUserId: payload.assignedUserId,
      assignerName: assigner.alias,
      assignerNameIv: assigner.aliasIv,
      taskName: task.title,
      taskNameIv: task.titleIv,
      projectId: task.projectId,
    };

    return notification;
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

  public async clearNotifications() {
    await this.prismaService.projectInviteNotification.deleteMany({});
  }

  public async getAllNotifications(
    user: string,
  ): Promise<[ProjectInviteNotification[], TaskAssignedNotification[]]> {
    const invitesPromise =
      this.prismaService.projectInviteNotification.findMany({
        where: { holderId: user },
        include: {
          holder: {
            select: {
              alias: true,
              aliasIv: true,
            },
          },
          project: {
            select: {
              name: true,
              nameIv: true,
            },
          },
          inviter: {
            select: {
              alias: true,
              aliasIv: true,
            },
          },
        },
      });
    const assignsPromise = this.prismaService.taskAssignedNotification.findMany(
      {
        where: { holderId: user },
        include: {
          holder: {
            select: {
              alias: true,
              aliasIv: true,
            },
          },
          task: {
            select: {
              title: true,
              titleIv: true,
              project: {
                select: {
                  name: true,
                  nameIv: true,
                },
              },
            },
          },
          inviter: {
            select: {
              alias: true,
              aliasIv: true,
            },
          },
        },
      },
    );

    return await Promise.all([invitesPromise, assignsPromise]);
  }
}
