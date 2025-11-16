import { Observable } from 'rxjs';
import { NotificationPayload } from '../services/notification.service';

export interface INotificationService {
  subscribe(userId: string): Observable<any>;
  sendNotificationToUser(
    userId: string,
    notification: NotificationPayload,
  ): void;
  handleProjectInvited(payload: {
    invitedUserId: string;
    inviterName: string;
    projectName: string;
    projectId: string;
  }): void;
  handleTaskAssigned(payload: {
    assignedUserId: string;
    assignerName: string;
    taskName: string;
  }): void;
}
