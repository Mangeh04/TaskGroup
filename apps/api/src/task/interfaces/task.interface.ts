import type { Task, User } from '@repo/database';
import { TaskDto } from '../dtos/taskDto.dto';
import { TaskDtoUpdate } from '../dtos/taskDtoUpdate.dto';

export type TasksArray = (Task & {
  assignments: Omit<User, 'createdAt' | 'updatedAt' | 'id'>[];
})[];

export interface ITaskService {
  createTask(taskDto: TaskDto): Promise<boolean>;
  findTask(taskId: string): Promise<Task>;
  deleteTask(taskId: string): Promise<boolean>;
  updateTask(taskDtoUpdate: TaskDtoUpdate): Promise<boolean>;
  getTasks(projectId: string): Promise<TasksArray>;
}
