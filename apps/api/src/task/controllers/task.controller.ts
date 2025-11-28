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

import { SERVICES } from 'src/utils/constants';

import { TaskDto } from '../dtos/taskDto.dto';
import type { ITaskService } from '../interfaces/task.interface';
import { ProjectMemberGuard } from 'src/project/guards/projectMember.guard';
import { TaskGuard } from '../guards/task.guard';
import { TaskDtoUpdate } from '../dtos/taskDtoUpdate.dto';
import { User } from 'src/auth/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('task')
export class TaskController {
  constructor(
    @Inject(SERVICES.TASK) private readonly taskService: ITaskService,
  ) {}

  @Post()
  @UseGuards(ProjectMemberGuard)
  async createTask(@Body() taskDto: TaskDto, @User() user: JwtPayload) {
    return this.taskService.createTask(user.sub, taskDto);
  }

  @Get(':projectId')
  @UseGuards(ProjectMemberGuard)
  async getTasks(@Param('projectId') projectId: string) {
    return this.taskService.getTasks(projectId);
  }

  @Patch(':id')
  @UseGuards(TaskGuard)
  async updateTask(
    @Param('id') taskId: string,
    @Body() taskDtoUpdate: TaskDtoUpdate,
    @User() user: JwtPayload,
  ) {
    return this.taskService.updateTask(
      { ...taskDtoUpdate, id: taskId },
      user.sub,
    );
  }

  @Delete(':id')
  @UseGuards(TaskGuard)
  async deleteTask(@Param('id') taskId: string) {
    return this.taskService.deleteTask(taskId);
  }

  @Post('id/cheked')
  async checkTask(@Param('id') taskId: string, @User() user: JwtPayload) {
    return await this.taskService.checkTask(taskId, user.sub);
  }
}
