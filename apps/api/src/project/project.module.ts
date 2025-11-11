import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { SERVICES } from 'src/utils/constants';
import { CryptoModule } from 'src/crypto/crypto.module';

import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';

@Module({
  imports: [PrismaModule, CryptoModule],
  providers: [
    {
      provide: SERVICES.PROJECT,
      useClass: ProjectService,
    },
  ],
  exports: [
    {
      provide: SERVICES.PROJECT,
      useClass: ProjectService,
    },
  ],
  controllers: [ProjectController],
})
export class ProjectModule {}
