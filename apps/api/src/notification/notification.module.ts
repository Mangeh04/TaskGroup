import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SERVICES } from 'src/utils/constants';
import { NotificationGateway } from './gateway/notification.gateway';
import { NotificationService } from './services/notification.service';
import { TaskModule } from 'src/task/task.module';
import { UserModule } from 'src/user/user.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { NotificationController } from './controllers/notification.controller';
import { DecryptModule } from 'src/decrypt/decrypt.module';

@Module({
  imports: [PrismaModule, CryptoModule, UserModule, TaskModule, DecryptModule],
  providers: [
    {
      provide: SERVICES.NOTIFICATION,
      useClass: NotificationService,
    },
    NotificationGateway,
  ],
  exports: [SERVICES.NOTIFICATION, NotificationGateway],
  controllers: [NotificationController],
})
export class NotificationModule {}
