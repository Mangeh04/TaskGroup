import type { Project } from '@repo/database';
import { ProjectDto } from '../dtos/projectDto.dto';
import { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';
import { ProjectMembership } from '@repo/database';

export interface IProjectService {
  createProject(userId: string, projectDto: ProjectDto): Promise<boolean>;
  findProject(projectId: string): Promise<Project>;
  deleteProject(projectId: string): Promise<boolean>;
  updateProject(projectDtoUpdate: ProjectDtoUpdate): Promise<boolean>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  getMembership(
    userId: string,
    projectId: string,
  ): Promise<ProjectMembership | null>;
}
