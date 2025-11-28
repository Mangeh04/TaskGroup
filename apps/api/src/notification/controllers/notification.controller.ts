import { Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { SERVICES } from 'src/utils/constants';
import type { INotificationService } from '../interfaces/notification.interface';
import { User } from 'src/auth/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(SERVICES.NOTIFICATION)
    private readonly notificationService: INotificationService,
  ) {}

  @Get()
  async getNotifications(@User() user: JwtPayload) {
    return await this.notificationService.getAllNotifications(user.sub);
  }

  @Delete('clear')
  async clearNotifications() {
    await this.notificationService.clearNotifications();
  }
}
