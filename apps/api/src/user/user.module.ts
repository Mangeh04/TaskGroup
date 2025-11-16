import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { SERVICES } from 'src/utils/constants';
import { CryptoModule } from 'src/crypto/crypto.module';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [PrismaModule, CryptoModule],
  providers: [
    {
      provide: SERVICES.USER,
      useClass: UserService,
    },
  ],
  exports: [SERVICES.USER],
  controllers: [UserController],
})
export class UserModule {}
