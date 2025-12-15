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
import type { Project } from '@repo/database';

import { SERVICES } from 'src/utils/constants';
import { User } from 'src/auth/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

import { ProjectGuard } from '../guards/project.guard';
import { ProjectOwnerGuard } from '../guards/projectOwner.guard';
import type { IProjectService } from '../interfaces/project.interface';

import { ProjectDto } from '../dtos/projectDto.dto';
import { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ProjectAdminGuard } from '../guards/projectAdmin.guard';
import { ProjectMember } from '@repo/types';
import { MemberDto } from '../dtos/projectMember.dto';

@Controller('project')
export class ProjectController {
  constructor(
    @Inject(SERVICES.PROJECT) private projectService: IProjectService,
  ) {}

  @Post()
  async createProject(
    @Body() projectDto: ProjectDto,
    @User() user: JwtPayload,
  ): Promise<boolean> {
    return this.projectService.createProject(user.sub, projectDto);
  }

  @Patch('update')
  @UseGuards(ProjectGuard)
  async updateProject(
    @Body() projectDtoUpdate: ProjectDtoUpdate,
  ): Promise<boolean> {
    return this.projectService.updateProject(projectDtoUpdate);
  }

  @Get()
  async getProjects(@User() user: JwtPayload): Promise<Project[]> {
    return this.projectService.getProjectsByUserId(user.sub);
  }

  @Get(':id')
  async getProject(@Param('id') projectId: string): Promise<Project | null> {
    return this.projectService.getProjectById(projectId);
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
    @User() user: JwtPayload,
  ): Promise<boolean> {
    if (user.sub === userIdToKick) {
      throw new BadRequestException(
        'An owner cannot remove themselves from the project. Please delete the project instead.',
      );
    }
    return this.projectService.removeMember(projectId, userIdToKick);
  }

  @Patch(':id/update/member/:memberId')
  @UseGuards(ProjectAdminGuard)
  async updateMemberRole(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @Body() body: MemberDto,
  ): Promise<boolean> {
    return this.projectService.updateMembership(memberId, projectId, body.role);
  }

  @Post(':id/invite')
  @UseGuards(ProjectAdminGuard)
  async inviteMember(
    @Param('id') projectId: string,
    @Body('email') email: string,
    @User() user: JwtPayload,
  ) {
    return this.projectService.inviteMember(projectId, email, user.sub);
  }

  @Post(':id/accept')
  async acceptInvitation(
    @Param('id') projectId: string,
    @User() user: JwtPayload,
  ) {
    return this.projectService.acceptInvitation(projectId, user.sub);
  }

  @Post(':id/decline')
  async declineInvitation(
    @Param('id') projectId: string,
    @User() user: JwtPayload,
  ) {
    return this.projectService.declineInvitation(projectId, user.sub);
  }

  @Post(':id/clear')
  async clearNotification(
    @Param('id') taskId: string,
    @User() user: JwtPayload,
  ) {
    return this.projectService.clearAssignedNotification(taskId, user.sub);
  }

  @Get(':id/members')
  async getMembers(@Param('id') projectId: string) {
    const members = await this.projectService.getMembersbyProjectId(projectId);
    const result: Array<ProjectMember> = [];

    for (const member of members) {
      result.push({
        userId: member.userId,
        role: member.role,
        user: member.user,
      });
    }

    return result;
  }
}
