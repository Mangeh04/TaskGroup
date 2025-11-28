import { EVENTS } from '@repo/types';

export interface ProjectInvitePayloadWithIv {
  invitedUserId: string;
  projectName: string;
  projectNameIv: string;
  projectId: string;
  inviterAlias: string;
  inviterAliasIv: string;
}

export interface TaskAssignedPayloadWithIv {
  assignedUserId: string;
  assignerName: string;
  assignerNameIv: string;
  taskName: string;
  taskNameIv: string;
  projectId: string;
}

export type NotificationPayloadWithIv =
  | ProjectInvitePayloadWithIv
  | TaskAssignedPayloadWithIv;
