import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, type Task, type Prisma } from '@repo/database';
import {
  AssignNotificationPayload,
  EVENTS,
  type TaskEndpoint,
} from '@repo/types';

import { SERVICES } from 'src/utils/constants';
import { CryptoService } from 'src/crypto/services/crypto.service';

import { TaskDto } from '../dtos/taskDto.dto';
import type { ITaskService } from '../interfaces/task.interface';
import { TaskDtoUpdate } from '../dtos/taskDtoUpdate.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
    @Inject(SERVICES.CRYPTO) private readonly cryptoService: CryptoService,
    private eventEmitter: EventEmitter2,
  ) {}

  private async mapDtoToCreateInput(
    createdByUserId: string,
    taskDto: TaskDto,
  ): Promise<Prisma.TaskCreateInput> {
    const encryptedName = await this.cryptoService.encrypt(taskDto.title);
    const assignedId = taskDto.assignedUserId ?? createdByUserId;

    const data: Prisma.TaskCreateInput = {
      title: encryptedName.ciphertext,
      titleIv: encryptedName.iv,
      isCompleted: taskDto.isCompleted,
      project: {
        connect: { id: taskDto.projectId },
      },
      assignedUser: {
        connect: {
          id: assignedId,
        },
      },
    };

    if (taskDto.description) {
      const encryptedDescription = await this.cryptoService.encrypt(
        taskDto.description,
      );
      data.description = encryptedDescription.ciphertext;
      data.descriptionIv = encryptedDescription.iv;
    }

    return data;
  }

  public async createTask(createdByUserId: string, taskDto: TaskDto) {
    const data = await this.mapDtoToCreateInput(createdByUserId, taskDto);
    const task = await this.prismaService.task.create({ data });

    if (createdByUserId != task.assignedUserId) {
      const taskAssignedPayload: AssignNotificationPayload = {
        assignedUserId: task.assignedUserId!,
        taskId: task.id,
        taskName: task.title,
        assignerUserId: createdByUserId,
        assignerName: '', // This field is not used in the event emitter
        projectId: taskDto.projectId,
      };
      this.eventEmitter.emit(EVENTS.TASK_ASSIGNED, taskAssignedPayload);
    }
    return true;
  }

  public async updateTask(taskDto: TaskDtoUpdate, updatedByUserId: string) {
    const dataToUpdate: Prisma.TaskUpdateInput = {};

    if (taskDto.title) {
      const encryptedName = await this.cryptoService.encrypt(taskDto.title);
      dataToUpdate.title = encryptedName.ciphertext;
      dataToUpdate.titleIv = encryptedName.iv;
    }

    if (taskDto.description) {
      const encryptedDescription = await this.cryptoService.encrypt(
        taskDto.description,
      );
      dataToUpdate.description = encryptedDescription.ciphertext;
      dataToUpdate.descriptionIv = encryptedDescription.iv;
    }

    if (taskDto.assignedUserId) {
      dataToUpdate.assignedUser = {
        connect: {
          id: taskDto.assignedUserId,
        },
      };

      if (dataToUpdate.isCompleted != null) {
        dataToUpdate.isCompleted = taskDto.isCompleted;
      }

      const updated = await this.prismaService.task.update({
        where: { id: taskDto.id },
        data: dataToUpdate,
      });

      if (taskDto.assignedUserId != updatedByUserId) {
        const taskAssignedPayload: AssignNotificationPayload = {
          assignedUserId: taskDto.assignedUserId,
          taskId: taskDto.id,
          taskName: updated.title,
          assignerUserId: updatedByUserId,
          assignerName: '', // This field is not used in the event emitter
          projectId: updated.projectId,
        };

        this.eventEmitter.emit(EVENTS.TASK_ASSIGNED, taskAssignedPayload);
      }
    }
    return true;
  }

  public async findTask(taskId: string) {
    return (await this.prismaService.task.findUnique({
      where: { id: taskId },
    })) as unknown as Promise<Task>;
  }

  public async deleteTask(taskId: string) {
    await this.prismaService.task.delete({
      where: { id: taskId },
    });
    return true;
  }

  public async getTasks(projectId: string) {
    return this.prismaService.task.findMany({
      where: { projectId: projectId },
      include: {
        assignedUser: {
          select: {
            id: true,
            alias: true,
            aliasIv: true,
            email: true,
            emailIv: true,
          },
        },
      },
    }) as unknown as Promise<TaskEndpoint[]>;
  }

  public async checkTask(taskId: string, userId: string) {
    await this.prismaService.taskAssignedNotification.deleteMany({
      where: {
        taskId: taskId,
        holderId: userId,
      },
    });

    return true;
  }
}
