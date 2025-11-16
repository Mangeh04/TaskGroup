import { Controller, Get, Sse, Req, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';

import type { INotificationService } from '../interfaces/notification.interface';
import { SERVICES } from 'src/utils/constants';

interface SseEvent {
  data: string | object;
  type?: string;
}

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(SERVICES.NOTIFICATION)
    private notificationsService: INotificationService,
  ) {}

  @Get('subscribe')
  @Sse()
  subscribe(@Req() req: any): Observable<SseEvent> {
    const userId = req.user.userId;
    return this.notificationsService.subscribe(userId);
  }
}
