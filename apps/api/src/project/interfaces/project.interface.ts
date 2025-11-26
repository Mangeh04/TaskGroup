import type { Project } from '@repo/database';
import type { ProjectDto } from '../dtos/projectDto.dto';
import type { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';
import type { ProjectMembership } from '@repo/database';
import type { SanitaizedUser } from 'src/user/interfaces/user.interface';

export type MembersProject = (Omit<ProjectMembership, 'projectId'> & {
  user: Omit<SanitaizedUser, 'id'>;
})[];

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
  assignTask(
    projectId: string,
    userIdToAssign: string,
    taskName: string,
    assignerName: string,
  ): Promise<boolean>;
  acceptInvitation(projectId: string, userId: string): Promise<boolean>;
  getNumUsersInProject(projectId: string): Promise<number>;
  getNumTasksForProject(projectId: string): Promise<number>;
  getNumUsersPerProject(): Promise<Record<string, number>>;
  getNumTasksPerProject(): Promise<Record<string, number>>;
  getMembersbyProjectId(projectId: string): Promise<MembersProject>;
}
