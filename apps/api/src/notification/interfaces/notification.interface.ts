import {
  ProjectInviteNotification,
  TaskAssignedNotification,
} from '@repo/database';
import type {
  AssignNotificationPayload,
  InviteNotificationPayload,
} from '@repo/types';

import { NotificationPayloadWithIv } from '../types/notification.types';

export interface INotificationService {
  createProjectInviteNotification(
    payload: InviteNotificationPayload,
  ): Promise<NotificationPayloadWithIv | null>;

  createTaskAssignedNotification(
    payload: AssignNotificationPayload,
  ): Promise<NotificationPayloadWithIv>;

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
