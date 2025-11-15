import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Project } from '@repo/database';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { SERVICES } from 'src/utils/constants';
import { User } from 'src/auth/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { ProjectGuard } from '../guards/project.guard';
import type { IProjectService } from '../interfaces/project.interface';

import { ProjectDto } from '../dtos/projectDto.dto';
import { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';

@Controller('project')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(
    @Inject(SERVICES.PROJECT) private projectService: IProjectService,
  ) {}

  @Post('create')
  createProject(
    @Body() projectDto: ProjectDto,
    @User() user: JwtPayload,
  ): Promise<boolean> {
    return this.projectService.createProject(user.userId, projectDto);
  }

  @Patch('update')
  @UseGuards(ProjectGuard)
  updateProject(@Body() projectDtoUpdate: ProjectDtoUpdate): Promise<boolean> {
    return this.projectService.updateProject(projectDtoUpdate);
  }

  @Get('recover-all')
  getProjects(@User() user: JwtPayload): Promise<Project[]> {
    return this.projectService.getProjectsByUserId(user.userId);
  }
}
