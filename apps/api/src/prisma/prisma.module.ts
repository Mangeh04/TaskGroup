import { Module } from '@nestjs/common';
import { SERVICES } from 'src/utils/constants';
import { PrismaService } from './services/prisma.service';

@Module({
  providers: [
    {
      provide: SERVICES.PRISMA,
      useClass: PrismaService,
    },
  ],
  exports: [SERVICES.PRISMA],
})
export class PrismaModule {}
