import type { Project } from '@repo/database';
import { ProjectDto } from '../dtos/projectDto.dto';
import { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';

export interface IProjectService {
  createProject(projectDto: ProjectDto): Promise<boolean>;
  findProject(projectId: string): Promise<Project>;
  deleteProject(projectId: string): Promise<boolean>;
  updateProject(projectDtoUpdate: ProjectDtoUpdate): Promise<boolean>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
}
