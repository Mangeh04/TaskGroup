import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, type Project, type Prisma, Role } from '@repo/database';
import { ProjectMembership } from '@repo/database';

import { SERVICES } from 'src/utils/constants';
import type { ICryptoService } from 'src/crypto/interfaces/crypto.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from 'src/utils/constants';

import { ProjectDto } from '../dtos/projectDto.dto';
import { IProjectService } from '../interfaces/project.interface';
import { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
    @Inject(SERVICES.CRYPTO) private readonly cryptoService: ICryptoService,
    private eventEmitter: EventEmitter2,
  ) {}

  private async mapDtoToCreateInput(
    userId: string,
    projectDto: ProjectDto,
  ): Promise<Prisma.ProjectCreateInput> {
    const encryptedName = await this.cryptoService.encrypt(projectDto.name);

    const data: Prisma.ProjectCreateInput = {
      name: encryptedName.ciphertext,
      nameIv: encryptedName.iv,
      members: {
        create: {
          role: Role.OWNER,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    };

    if (projectDto.description) {
      const encryptedDescription = await this.cryptoService.encrypt(
        projectDto.description,
      );
      data.description = encryptedDescription.ciphertext;
      data.descriptionIv = encryptedDescription.iv;
    }

    return data;
  }

  private async mapDtoToUpdateInput(
    projectDto: ProjectDto,
  ): Promise<Prisma.ProjectUpdateInput> {
    const encryptedName = await this.cryptoService.encrypt(projectDto.name);

    const data: Prisma.ProjectUpdateInput = {
      name: encryptedName.ciphertext,
      nameIv: encryptedName.iv,
    };

    if (projectDto.description) {
      const encryptedDescription = await this.cryptoService.encrypt(
        projectDto.description,
      );
      data.description = encryptedDescription.ciphertext;
      data.descriptionIv = encryptedDescription.iv;
    }

    return data;
  }

  public async createProject(userId: string, projectDto: ProjectDto) {
    const data = await this.mapDtoToCreateInput(userId, projectDto);
    await this.prismaService.project.create({ data });
    return true;
  }

  public async updateProject(projectDto: ProjectDtoUpdate) {
    const data = await this.mapDtoToUpdateInput(projectDto);
    await this.prismaService.project.update({
      where: { id: projectDto.id },
      data,
    });
    return true;
  }

  public async findProject(projectId: string) {
    return (await this.prismaService.project.findUnique({
      where: { id: projectId },
    })) as unknown as Promise<Project>;
  }

  public async deleteProject(projectId: string) {
    await this.prismaService.project.delete({ where: { id: projectId } });
    return true;
  }

  public async getProjectsByUserId(userId: string) {
    return await this.prismaService.project.findMany({
      where: { members: { some: { userId } } },
    });
  }

  async getMembership(
    userId: string,
    projectId: string,
  ): Promise<ProjectMembership | null> {
    return this.prismaService.projectMembership.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });
  }

  async removeMember(
    projectId: string,
    userIdToKick: string,
  ): Promise<boolean> {
    await this.prismaService.projectMembership.deleteMany({
      where: {
        projectId: projectId,
        userId: userIdToKick,
      },
    });
    return true;
  }

  async inviteMember(
    projectId: string,
    userIdToInvite: string,
    inviterName: string,
    projectName: string,
  ) {
    this.eventEmitter.emit(EVENTS.PROJECT_INVITED, {
      invitedUserId: userIdToInvite,
      projectId: projectId,
      inviterName: inviterName,
      projectName: projectName,
    });
    return true;
  }

  async assignTask(
    projectId: string,
    userIdToAssign: string,
    taskName: string,
    assignerName: string,
  ) {
    this.eventEmitter.emit(EVENTS.TASK_ASSIGNED, {
      taskName: taskName,
      assignedUserId: userIdToAssign,
      assignerName: assignerName,
    });
    return true;
  }

  async acceptInvitation(projectId: string, userId: string) {
    await this.prismaService.projectMembership.create({
      data: {
        projectId: projectId,
        userId: userId,
        role: Role.MEMBER,
      },
    });
    return true;
  }

  async getNumUsersInProject(projectId: string): Promise<number> {
    return this.prismaService.projectMembership.count({
      where: { projectId: projectId },
    });
  }

  async getNumTasksForProject(projectId: string): Promise<number> {
    return this.prismaService.task.count({
      where: { projectId: projectId },
    });
  }
}
