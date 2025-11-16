import { Module } from '@nestjs/common';
import { SERVICES } from 'src/utils/constants';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: SERVICES.NOTIFICATION,
      useExisting: NotificationService,
    },
  ],
  exports: [SERVICES.NOTIFICATION],
})
export class NotificationModule {}
