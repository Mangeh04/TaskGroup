import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Task } from '@repo/database';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { SERVICES } from 'src/utils/constants';

import { TaskDto } from '../dtos/taskDto.dto';
import type { ITaskService } from '../interfaces/task.interface';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(
    @Inject(SERVICES.TASK) private readonly taskService: ITaskService,
  ) {}

  @Post()
  async createTask(@Body() taskDto: TaskDto): Promise<boolean> {
    return true;
  }

  @Get('recover-all/:projectId')
  async getTasks(@Param('projectId') projectId: string): Promise<Task[]> {
    return this.taskService.getTasks(projectId);
  }
}
