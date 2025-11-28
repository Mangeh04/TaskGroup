import {
  ProjectInviteNotification,
  TaskAssignedNotification,
} from '@repo/database';
import { NotificationPayloadWithIv } from '../types/notification.types';

export interface INotificationService {
  createProjectInviteNotification(payload: {
    invitedUserId: string;
    inviterId: string;
    projectName: string;
    projectId: string;
    inviterAlias: string;
  }): Promise<NotificationPayloadWithIv | null>;

  createTaskAssignedNotification(payload: {
    assignedUserId: string;
    taskId: string;
    assignerId: string;
  }): Promise<NotificationPayloadWithIv>;

  checkExistingInvite(
    projectId: string,
    holderId: string,
    inviterId: string,
  ): Promise<boolean>;
  clearNotifications(): Promise<void>;
  getAllNotifications(
    user: string,
  ): Promise<[ProjectInviteNotification[], TaskAssignedNotification[]]>;
}
