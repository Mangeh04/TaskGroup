import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Notification, type UserNotification } from '@repo/database';
import { EVENTS } from 'src/utils/constants';
import type { INotificationService } from '../interfaces/notification.interface';

export type NotificationPayload = Omit<UserNotification, 'userId'>;

type UserChannel = Subject<NotificationPayload>;

interface UserChannelEntry {
  channel: UserChannel;
  subscribers: number;
}

@Injectable()
export class NotificationService implements INotificationService {
  private userChannels = new Map<string, UserChannelEntry>();

  subscribe(userId: string): Observable<NotificationPayload> {
    let entry = this.userChannels.get(userId);

    if (!entry) {
      entry = {
        channel: new Subject<NotificationPayload>(),
        subscribers: 0,
      };
      this.userChannels.set(userId, entry);
    }

    entry.subscribers++;
    const { channel } = entry;

    return channel.asObservable().pipe(
      finalize(() => {
        const current = this.userChannels.get(userId);
        if (!current) return;

        current.subscribers--;
        if (current.subscribers <= 0) {
          current.channel.complete();
          this.userChannels.delete(userId);
        }
      }),
    );
  }

  sendNotificationToUser(userId: string, notification: NotificationPayload) {
    const entry = this.userChannels.get(userId);
    if (!entry) return;

    entry.channel.next(notification);
  }

  @OnEvent(EVENTS.PROJECT_INVITED)
  handleProjectInvited(payload: {
    invitedUserId: string;
    inviterName: string;
    projectName: string;
    projectId: string;
  }) {
    const { invitedUserId, inviterName, projectName } = payload;

    const notification: NotificationPayload = {
      title: 'New invitation',
      description: `You have been invited by ${inviterName} to join ${projectName}`,
      projectId: payload.projectId,
      type: Notification.INVITE,
    };

    this.sendNotificationToUser(invitedUserId, notification);
  }

  @OnEvent(EVENTS.TASK_ASSIGNED)
  handleTaskAssigned(payload: {
    assignedUserId: string;
    assignerName: string;
    taskName: string;
  }) {
    const { assignedUserId, assignerName, taskName } = payload;

    const notification: NotificationPayload = {
      title: 'New assigned task',
      description: `You have a new assignment posted by ${assignerName} in ${taskName}`,
      projectId: null,
      type: Notification.ASSIGNMENT,
    };

    this.sendNotificationToUser(assignedUserId, notification);
  }
}
