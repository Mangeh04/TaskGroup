import type { Task } from '@repo/database';
import { TaskDto } from '../dtos/taskDto.dto';
import { TaskDtoUpdate } from '../dtos/taskDtoUpdate.dto';

export interface ITaskService {
  createTask(taskDto: TaskDto): Promise<boolean>;
  findTask(taskId: string): Promise<Task>;
  deleteTask(taskId: string): Promise<boolean>;
  updateTask(taskDtoUpdate: TaskDtoUpdate): Promise<boolean>;
  getTasks(projectId: string): Promise<Task[]>;
}
