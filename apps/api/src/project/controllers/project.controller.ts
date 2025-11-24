import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { Project, Role } from '@repo/database';

import { SERVICES } from 'src/utils/constants';
import { User } from 'src/auth/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

import { ProjectGuard } from '../guards/project.guard';
import { ProjectOwnerGuard } from '../guards/projectOwner.guard';
import type { IProjectService } from '../interfaces/project.interface';

import { ProjectDto } from '../dtos/projectDto.dto';
import { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { SanitaizedUser } from 'src/user/interfaces/user.interface';

type ResultArray = {
  userId: string;
  role: Role;
} & Omit<SanitaizedUser, 'id'>;

@Controller('project')
export class ProjectController {
  constructor(
    @Inject(SERVICES.PROJECT) private projectService: IProjectService,
  ) {}

  @Post('create')
  createProject(
    @Body() projectDto: ProjectDto,
    @User() user: JwtPayload,
  ): Promise<boolean> {
    return this.projectService.createProject(user.sub, projectDto);
  }

  @Patch('update')
  @UseGuards(ProjectGuard)
  updateProject(@Body() projectDtoUpdate: ProjectDtoUpdate): Promise<boolean> {
    return this.projectService.updateProject(projectDtoUpdate);
  }

  @Get('recover-all')
  getProjects(@User() user: JwtPayload): Promise<Project[]> {
    return this.projectService.getProjectsByUserId(user.sub);
  }

  @Delete(':id')
  @UseGuards(ProjectOwnerGuard)
  async deleteProject(@Param('id') projectId: string): Promise<boolean> {
    return this.projectService.deleteProject(projectId);
  }

  @Delete(':id/member/:memberId')
  @UseGuards(ProjectOwnerGuard)
  async removeMember(
    @Param('id') projectId: string,
    @Param('memberId') userIdToKick: string,
    @User() actor: JwtPayload,
  ): Promise<boolean> {
    if (actor.sub === userIdToKick) {
      throw new BadRequestException(
        'An owner cannot remove themselves from the project. Please delete the project instead.',
      );
    }
    return this.projectService.removeMember(projectId, userIdToKick);
  }

  @Post(':id/accept')
  acceptInvitation(@Param('id') projectId: string, @User() user: JwtPayload) {
    return this.projectService.acceptInvitation(projectId, user.sub);
  }

  @Get(':id/members')
  async getMembers(@Param('id') projectId: string) {
    const members = await this.projectService.getMembersbyProjectId(projectId);
    const result: Array<ResultArray> = [];

    for (const member of members) {
      result.push({
        userId: member.userId,
        role: member.role,
        ...member.user,
      });
    }

    return result;
  }
}
