import type { Task } from '@repo/database';
import type { TaskEndpoint } from '@repo/types';

import { TaskDto } from '../dtos/taskDto.dto';
import { TaskDtoUpdate } from '../dtos/taskDtoUpdate.dto';

export interface ITaskService {
  createTask(createdByUserId: string, taskDto: TaskDto): Promise<boolean>;
  findTask(taskId: string): Promise<Task>;
  deleteTask(taskId: string): Promise<boolean>;
  updateTask(
    taskDtoUpdate: TaskDtoUpdate,
    updatedByUser: string,
  ): Promise<boolean>;
  getTasks(projectId: string): Promise<TaskEndpoint[]>;
}
