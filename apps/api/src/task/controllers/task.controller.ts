import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { Task } from '@repo/database';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { SERVICES } from 'src/utils/constants';

import { TaskDto } from '../dtos/taskDto.dto';
import type { ITaskService } from '../interfaces/task.interface';
import { ProjectMemberGuard } from 'src/project/guards/projectMember.guard';
import { TaskGuard } from '../guards/task.guard';
import { TaskDtoUpdate } from '../dtos/taskDtoUpdate.dto';

@Controller('task')
export class TaskController {
  constructor(
    @Inject(SERVICES.TASK) private readonly taskService: ITaskService,
  ) {}

  @Post()
  @UseGuards(ProjectMemberGuard)
  async createTask(@Body() taskDto: TaskDto): Promise<boolean> {
    return this.taskService.createTask(taskDto);
  }

  @Get(':projectId')
  @UseGuards(ProjectMemberGuard)
  async getTasks(@Param('projectId') projectId: string): Promise<Task[]> {
    return this.taskService.getTasks(projectId);
  }

  @Patch(':id')
  @UseGuards(TaskGuard)
  async updateTask(
    @Param('id') taskId: string,
    @Body() taskDtoUpdate: TaskDtoUpdate,
  ): Promise<boolean> {
    return this.taskService.updateTask({ ...taskDtoUpdate, id: taskId });
  }

  @Delete(':id')
  @UseGuards(TaskGuard)
  async deleteTask(@Param('id') taskId: string): Promise<boolean> {
    return this.taskService.deleteTask(taskId);
  }
}
