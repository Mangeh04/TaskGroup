import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, type Project, type Prisma } from '@repo/database';

import { SERVICES } from 'src/utils/constants';
import { CryptoService } from 'src/crypto/services/crypto.service';

import { ProjectDto } from '../dtos/projectDto.dto';
import { IProjectService } from '../interfaces/project.interface';
import { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
    @Inject(SERVICES.CRYPTO) private readonly cryptoService: CryptoService,
  ) {}

  private async mapDtoToCreateInput(
    projectDto: ProjectDto,
  ): Promise<Prisma.ProjectCreateInput> {
    const encryptedName = await this.cryptoService.encrypt(projectDto.name);

    const data: Prisma.ProjectCreateInput = {
      name: encryptedName.ciphertext,
      nameIv: encryptedName.iv,
      users: {
        connect: { id: projectDto.createdByUserId },
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

  public async createProject(projectDto: ProjectDto) {
    const data = await this.mapDtoToCreateInput(projectDto);
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
    return this.prismaService.project.findMany({
      where: { users: { some: { id: userId } } },
    }) as unknown as Promise<Project[]>;
  }
}
