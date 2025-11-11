import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Project } from '@repo/database';

import { ProjectDto } from '../dtos/projectDto.dto';
import { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { SERVICES } from 'src/utils/constants';
import type { IProjectService } from '../interfaces/project.interface';

@Controller('project')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(
    @Inject(SERVICES.PROJECT) private projectService: IProjectService,
  ) {}

  @Post('create')
  createProject(@Body() projectDto: ProjectDto): Promise<boolean> {
    return this.projectService.createProject(projectDto);
  }

  @Patch('update')
  updateProject(@Body() projectDtoUpdate: ProjectDtoUpdate): Promise<boolean> {
    return this.projectService.updateProject(projectDtoUpdate);
  }

  @Get('recover-all/:userId')
  getProjects(@Param('userId') userId: string): Promise<Project[]> {
    return this.projectService.getProjectsByUserId(userId);
  }
}
