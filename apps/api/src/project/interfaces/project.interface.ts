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
  removeMember(projectId: string, userIdToKick: string): Promise<boolean>;
  inviteMember(
    projectId: string,
    userIdToInvite: string,
    inviterName: string,
    projectName: string,
  ): Promise<boolean>;
  assignTask(
    projectId: string,
    userIdToAssign: string,
    taskName: string,
    assignerName: string,
  ): Promise<boolean>;
  acceptInvitation(projectId: string, userId: string): Promise<boolean>;
  getNumUsersInProject(projectId: string): Promise<number>;
  getNumTasksForProject(projectId: string): Promise<number>;
}
