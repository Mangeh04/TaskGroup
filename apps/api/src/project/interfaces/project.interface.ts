import type { Project } from '@repo/database';
import type { ProjectMembership } from '@repo/database';
import type { ProjectMember } from '@repo/types';

import type { ProjectDto } from '../dtos/projectDto.dto';
import type { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';

export interface IProjectService {
  createProject(userId: string, projectDto: ProjectDto): Promise<boolean>;
  findProject(projectId: string): Promise<Project>;
  deleteProject(projectId: string): Promise<boolean>;
  updateProject(projectDtoUpdate: ProjectDtoUpdate): Promise<boolean>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  getProjectById(projectId: string): Promise<Project | null>;
  getMembership(
    userId: string,
    projectId: string,
  ): Promise<ProjectMembership | null>;
  removeMember(projectId: string, userIdToKick: string): Promise<boolean>;
  inviteMember(
    projectId: string,
    userEmailToInvite: string,
    inviterName: string,
  ): Promise<boolean>;
  acceptInvitation(projectId: string, userId: string): Promise<boolean>;
  getNumUsersInProject(projectId: string): Promise<number>;
  getNumTasksForProject(projectId: string): Promise<number>;
  getNumUsersPerProject(): Promise<Record<string, number>>;
  getNumTasksPerProject(): Promise<Record<string, number>>;
  isUserInProject(userId: string, projectId: string): Promise<boolean>;
  getMembersbyProjectId(projectId: string): Promise<ProjectMember[]>;
}
