export interface INotificationService {
  handleProjectInvited(payload: {
    invitedUserId: string;
    inviterId: string;
    projectName: string;
    projectId: string;
    inviterAlias: string;
  }): void;
  handleTaskAssigned(payload: {
    assignedUserId: string;
    taskId: string;
    assignerId: string;
  }): void;
  checkExistingInvite(
    projectId: string,
    holderId: string,
    inviterId: string,
  ): Promise<boolean>;
}
