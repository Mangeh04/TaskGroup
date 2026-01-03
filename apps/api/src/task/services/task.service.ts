import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { PrismaClient, type Task, type Prisma } from '@repo/database';
import {
  AssignNotificationPayload,
  EVENTS,
  type TaskEndpoint,
} from '@repo/types';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  ERROR_CODES,
  SERVICES,
  TASK_GUARD_ERROR_CODES,
} from 'src/utils/constants';
import { CryptoService } from 'src/crypto/services/crypto.service';

import { TaskDto } from '../dtos/taskDto.dto';
import type { ITaskService } from '../interfaces/task.interface';
import { TaskDtoUpdate } from '../dtos/taskDtoUpdate.dto';

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
      state: taskDto.state,
      priority: taskDto.priority,
      initialDate: taskDto.initialDate,
      dueDate: taskDto.dueDate,
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

    const current = await this.prismaService.task.findUnique({
      where: { id: taskDto.id },
      select: {
        assignedUserId: true,
        projectId: true,
        title: true,
      },
    });

    if (!current)
      throw new BadRequestException({
        message: TASK_GUARD_ERROR_CODES.TASK_NOT_FOUND,
      });

    if (taskDto.title !== undefined) {
      const encryptedName = await this.cryptoService.encrypt(taskDto.title);
      dataToUpdate.title = encryptedName.ciphertext;
      dataToUpdate.titleIv = encryptedName.iv;
    }

    if (taskDto.description !== undefined) {
      if (taskDto.description === '' || taskDto.description === null) {
        dataToUpdate.description = null;
        dataToUpdate.descriptionIv = null;
      } else {
        const encryptedDescription = await this.cryptoService.encrypt(
          taskDto.description,
        );
        dataToUpdate.description = encryptedDescription.ciphertext;
        dataToUpdate.descriptionIv = encryptedDescription.iv;
      }
    }

    if (taskDto.state !== undefined) dataToUpdate.state = taskDto.state;
    if (taskDto.priority !== undefined)
      dataToUpdate.priority = taskDto.priority;

    const nextAssignedUserId =
      taskDto.assignedUserId !== undefined
        ? taskDto.assignedUserId
        : current.assignedUserId;

    if (taskDto.assignedUserId !== undefined) {
      dataToUpdate.assignedUser = taskDto.assignedUserId
        ? { connect: { id: taskDto.assignedUserId } }
        : { disconnect: true };
    }

    if (taskDto.initialDate !== undefined) {
      dataToUpdate.initialDate = taskDto.initialDate
        ? new Date(taskDto.initialDate)
        : null;
    }

    if (taskDto.dueDate !== undefined) {
      dataToUpdate.dueDate = taskDto.dueDate ? new Date(taskDto.dueDate) : null;
    }

    const updated = await this.prismaService.task.update({
      where: { id: taskDto.id },
      data: dataToUpdate,
    });

    const assignedChanged =
      taskDto.assignedUserId !== undefined &&
      taskDto.assignedUserId !== current.assignedUserId;

    if (
      assignedChanged &&
      nextAssignedUserId &&
      nextAssignedUserId !== updatedByUserId
    ) {
      this.eventEmitter.emit(EVENTS.TASK_ASSIGNED, {
        assignedUserId: nextAssignedUserId,
        taskId: taskDto.id,
        taskName: updated.title,
        assignerUserId: updatedByUserId,
        assignerName: '',
        projectId: updated.projectId,
      } satisfies AssignNotificationPayload);
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
