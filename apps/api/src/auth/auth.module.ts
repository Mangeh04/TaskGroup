import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { UserModule } from 'src/user/user.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { AuthController } from './controllers/auth.controller';
import { SERVICES } from 'src/utils/constants';

@Module({
  imports: [ConfigModule, UserModule, CryptoModule],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: SERVICES.AUTH,
      useExisting: AuthService,
    },
  ],
  exports: [SERVICES.AUTH],
  controllers: [AuthController],
})
export class AuthModule {}
