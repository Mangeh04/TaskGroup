import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, type Project, type Prisma, Role } from '@repo/database';
import { ProjectMembership } from '@repo/database';

import { PROJECT_SERVICE_ERROR_CODES, SERVICES } from 'src/utils/constants';
import type { ICryptoService } from 'src/crypto/interfaces/crypto.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS, ProjectMember } from '@repo/types';

import { ProjectDto } from '../dtos/projectDto.dto';
import type { IProjectService } from '../interfaces/project.interface';
import { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';
import type { IUserService } from 'src/user/interfaces/user.interface';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
    @Inject(SERVICES.CRYPTO) private readonly cryptoService: ICryptoService,
    @Inject(SERVICES.USER) private readonly userService: IUserService,
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
      category: projectDto.category,
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
    const data = await this.mapDtoToUpdateInput(projectDto as ProjectDto);
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
    await this.prismaService.project.delete({
      where: { id: projectId },
    });
    return true;
  }

  public async getProjectsByUserId(userId: string) {
    const projectsPromise = this.prismaService.project.findMany({
      where: { members: { some: { userId } } },
    });

    const usersPerProjectPromise = this.getNumUsersPerProject();
    const tasksPerProjectPromise = this.getNumTasksPerProject();

    const [projects, usersPerProject, tasksPerProject] = await Promise.all([
      projectsPromise,
      usersPerProjectPromise,
      tasksPerProjectPromise,
    ]);

    return projects.map((project) => ({
      ...project,
      membersCount: usersPerProject[project.id] ?? 0,
      tasksCount: tasksPerProject[project.id] ?? 0,
    }));
  }

  public async getProjectById(projectId: string) {
    return this.prismaService.project.findUnique({
      where: { id: projectId },
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

  async updateMembership(userId: string, projectId: string, newRole: Role) {
    await this.prismaService.projectMembership.update({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      data: {
        role: newRole,
      },
    });

    return true;
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
    userEmailToInvite: string,
    inviterId: string,
  ) {
    const userToInvite =
      await this.userService.findUserByEmail(userEmailToInvite);
    if (!userToInvite) {
      throw new NotFoundException({
        message: PROJECT_SERVICE_ERROR_CODES.USER_NOT_FOUND_BY_EMAIL,
      });
    }

    const inviter = await this.userService.findUser(inviterId);
    const project = await this.findProject(projectId);

    if (!project) {
      throw new NotFoundException({
        message: PROJECT_SERVICE_ERROR_CODES.PROJECT_NOT_FOUND,
      });
    }

    const existingMembership =
      await this.prismaService.projectInviteNotification.findFirst({
        where: {
          projectId,
          holderId: inviterId,
          inviterId,
        },
      });

    if (existingMembership != null) {
      throw new ConflictException({
        message: PROJECT_SERVICE_ERROR_CODES.USER_ALREADY_INVITED,
      });
    }

    if (await this.isUserInProject(userToInvite.id, projectId)) {
      throw new ConflictException({
        message: PROJECT_SERVICE_ERROR_CODES.USER_ALREADY_MEMBER,
      });
    }

    this.eventEmitter.emit(EVENTS.PROJECT_INVITED, {
      invitedUserId: userToInvite.id,
      projectId: projectId,
      inviterId: inviterId,
      projectName: project.name,
      inviterAlias: inviter.alias,
    });

    return true;
  }

  async acceptInvitation(projectId: string, userId: string) {
    const createPromise = this.prismaService.projectMembership.create({
      data: {
        projectId: projectId,
        userId: userId,
        role: Role.MEMBER,
      },
    });

    const deletePromise =
      this.prismaService.projectInviteNotification.deleteMany({
        where: { projectId: projectId, holderId: userId },
      });

    await Promise.all([createPromise, deletePromise]);
    return true;
  }

  async declineInvitation(projectId: string, userId: string) {
    await this.prismaService.projectInviteNotification.deleteMany({
      where: { projectId: projectId, holderId: userId },
    });

    return true;
  }

  async clearAssignedNotification(taskId: string, userId: string) {
    await this.prismaService.taskAssignedNotification.deleteMany({
      where: { taskId: taskId, holderId: userId },
    });
    return true;
  }

  async getNumUsersInProject(projectId: string): Promise<number> {
    return this.prismaService.projectMembership.count({
      where: { projectId: projectId },
    });
  }

  async getNumUsersPerProject() {
    const results = await this.prismaService.projectMembership.groupBy({
      by: ['projectId'],
      _count: {
        projectId: true,
      },
    });

    const map: Record<string, number> = {};
    for (const row of results) {
      map[row.projectId] = row._count.projectId;
    }

    return map;
  }

  async getNumTasksForProject(projectId: string) {
    return this.prismaService.task.count({
      where: { projectId: projectId },
    });
  }

  async getNumTasksPerProject() {
    const results = await this.prismaService.task.groupBy({
      by: ['projectId'],
      _count: {
        projectId: true,
      },
    });

    const map: Record<string, number> = {};
    for (const row of results) {
      map[row.projectId] = row._count.projectId;
    }

    return map;
  }

  async isUserInProject(userId: string, projectId: string) {
    const member = await this.prismaService.projectMembership.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    return member != null;
  }

  async getMembersbyProjectId(projectId: string) {
    return this.prismaService.projectMembership.findMany({
      where: { projectId: projectId },
      include: {
        user: {
          omit: {
            password: true,
            emailBi: true,
            createdAt: true,
            updatedAt: true,
            id: true,
          },
          include: {
            config: {
              select: {
                status: true,
              },
            },
          },
        },
      },
      omit: {
        projectId: true,
      },
    }) as unknown as ProjectMember[];
  }
}
