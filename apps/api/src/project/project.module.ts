import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { SERVICES } from 'src/utils/constants';
import { CryptoModule } from 'src/crypto/crypto.module';
import { UserModule } from 'src/user/user.module';

import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';

import { ProjectMemberGuard } from './guards/projectMember.guard';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [PrismaModule, CryptoModule, UserModule, NotificationModule],
  providers: [
    {
      provide: SERVICES.PROJECT,
      useClass: ProjectService,
    },
    ProjectMemberGuard,
  ],
  exports: [SERVICES.PROJECT, ProjectMemberGuard],
  controllers: [ProjectController],
})
export class ProjectModule {}
