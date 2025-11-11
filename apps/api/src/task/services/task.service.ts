import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, type Task, type Prisma } from '@repo/database';

import { SERVICES } from 'src/utils/constants';
import { CryptoService } from 'src/crypto/services/crypto.service';

import { TaskDto } from '../dtos/taskDto.dto';
import { ITaskService } from '../interfaces/task.interface';
import { TaskDtoUpdate } from '../dtos/taskDtoUpdate.dto';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
    @Inject(SERVICES.CRYPTO) private readonly cryptoService: CryptoService,
  ) {}

  private async mapDtoToCreateInput(
    TaskDto: TaskDto,
  ): Promise<Prisma.TaskCreateInput> {
    const encryptedName = await this.cryptoService.encrypt(TaskDto.title);

    const data: Prisma.TaskCreateInput = {
      title: encryptedName.ciphertext,
      titleIv: encryptedName.iv,
      user: {
        connect: { id: TaskDto.userId },
      },
      project: {
        connect: { id: TaskDto.projectId },
      },
    };

    if (TaskDto.description) {
      const encryptedDescription = await this.cryptoService.encrypt(
        TaskDto.description,
      );
      data.description = encryptedDescription.ciphertext;
      data.descriptionIv = encryptedDescription.iv;
    }

    return data;
  }

  private async mapDtoToUpdateInput(
    TaskDto: TaskDto,
  ): Promise<Prisma.TaskUpdateInput> {
    const encryptedName = await this.cryptoService.encrypt(TaskDto.title);

    const data: Prisma.TaskUpdateInput = {
      title: encryptedName.ciphertext,
      titleIv: encryptedName.iv,
    };

    if (TaskDto.description) {
      const encryptedDescription = await this.cryptoService.encrypt(
        TaskDto.description,
      );
      data.description = encryptedDescription.ciphertext;
      data.descriptionIv = encryptedDescription.iv;
    }

    return data;
  }

  public async createTask(TaskDto: TaskDto) {
    const data = await this.mapDtoToCreateInput(TaskDto);
    await this.prismaService.task.create({ data });
    return true;
  }

  public async updateTask(TaskDto: TaskDtoUpdate) {
    const data = await this.mapDtoToUpdateInput(TaskDto);
    await this.prismaService.task.update({
      where: { id: TaskDto.id },
      data,
    });
    return true;
  }

  public async findTask(TaskId: string) {
    return (await this.prismaService.task.findUnique({
      where: { id: TaskId },
    })) as unknown as Promise<Task>;
  }

  public async deleteTask(TaskId: string) {
    await this.prismaService.task.delete({ where: { id: TaskId } });
    return true;
  }

  public async getTasks(projectId: string) {
    return this.prismaService.task.findMany({
      where: { project: { is: { id: projectId } } },
    }) as unknown as Promise<Task[]>;
  }
}
