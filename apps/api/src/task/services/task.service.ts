import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, type Task, type Prisma } from '@repo/database';

import { SERVICES } from 'src/utils/constants';
import { CryptoService } from 'src/crypto/services/crypto.service';

import { TaskDto } from '../dtos/taskDto.dto';
import type { ITaskService, TasksArray } from '../interfaces/task.interface';
import { TaskDtoUpdate } from '../dtos/taskDtoUpdate.dto';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
    @Inject(SERVICES.CRYPTO) private readonly cryptoService: CryptoService,
  ) {}

  private async mapDtoToCreateInput(
    taskDto: TaskDto,
  ): Promise<Prisma.TaskCreateInput> {
    const encryptedName = await this.cryptoService.encrypt(taskDto.title);

    const userAssignments = taskDto.userIds.map((id) => ({
      user: {
        connect: { id: id },
      },
    }));

    const data: Prisma.TaskCreateInput = {
      title: encryptedName.ciphertext,
      titleIv: encryptedName.iv,
      project: {
        connect: { id: taskDto.projectId },
      },
      assignments: {
        create: userAssignments,
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

  public async createTask(taskDto: TaskDto) {
    const data = await this.mapDtoToCreateInput(taskDto);
    await this.prismaService.task.create({ data });
    return true;
  }

  public async updateTask(taskDto: TaskDtoUpdate) {
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

    if (taskDto.userIds) {
      dataToUpdate.assignments = {
        create: taskDto.userIds.map((id) => ({
          user: { connect: { id } },
        })),
      };
    }

    await this.prismaService.task.update({
      where: { id: taskDto.id },
      data: dataToUpdate,
    });
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
        assignments: {
          include: {
            user: {
              select: {
                alias: true,
                aliasIv: true,
                email: true,
                emailIv: true,
              },
            },
          },
        },
      },
    }) as unknown as Promise<TasksArray>;
  }
}
