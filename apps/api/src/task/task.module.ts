import { Module } from '@nestjs/common';

import { TaskService } from './services/task.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { SERVICES } from 'src/utils/constants';
import { TaskController } from './controllers/task.controller';

@Module({
  imports: [PrismaModule, CryptoModule],
  providers: [
    {
      provide: SERVICES.TASK,
      useClass: TaskService,
    },
  ],
  exports: [SERVICES.TASK],
  controllers: [TaskController],
})
export class TaskModule {}
