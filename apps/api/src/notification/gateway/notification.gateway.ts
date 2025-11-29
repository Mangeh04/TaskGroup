import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import {
  EVENTS,
  type InviteNotificationPayload,
  type AssignNotificationPayload,
} from '@repo/types';

import { SERVICES } from 'src/utils/constants';
import type { INotificationService } from '../interfaces/notification.interface';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

import * as cookie from 'cookie';
import type { IDecryptService } from 'src/decrypt/interfaces/decrypt.interface';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: 'notification',
})
@Injectable()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(
    @Inject(SERVICES.NOTIFICATION)
    private readonly notificationService: INotificationService,
    @Inject(SERVICES.DECRYPT) private readonly decryptService: IDecryptService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const rawCookie = client.handshake.headers.cookie;
      if (!rawCookie) {
        client.emit(EVENTS.AUTH_ERROR, 'no_cookie');
        client.disconnect();
        return;
      }

      const cookies = cookie.parse(rawCookie);
      const token = cookies['access_token'];

      if (!token) {
        client.emit(EVENTS.AUTH_ERROR, 'no_token');
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      const userId = payload.sub;
      if (!userId) {
        client.emit(EVENTS.AUTH_ERROR, 'invalid_token');
        client.disconnect();
        return;
      }

      await client.join(userId);
    } catch (e) {
      this.logger.error(`[CRITICAL] Error validating token: ${e.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket ${client.id} disconnected`);
  }

  async sendToUser(userId: string, event: string, data: any) {
    const decrypted = await this.decryptService.decryptDeep(data);
    this.server.to(userId).emit(event, decrypted);
  }

  @OnEvent(EVENTS.PROJECT_INVITED)
  public async onProjectInvited(payload: InviteNotificationPayload) {
    const notification =
      await this.notificationService.createProjectInviteNotification(payload);

    if (!notification) {
      this.logger.warn(
        `Could not send invitation for project: ${payload.projectId}`,
      );
      return;
    }

    await this.sendToUser(
      payload.invitedUserId,
      EVENTS.PROJECT_INVITED,
      notification,
    );
  }

  @OnEvent(EVENTS.TASK_ASSIGNED)
  public async onTaskAssigned(payload: AssignNotificationPayload) {
    const notification =
      await this.notificationService.createTaskAssignedNotification(payload);

    await this.sendToUser(
      payload.assignedUserId,
      EVENTS.TASK_ASSIGNED,
      notification,
    );
  }
}
