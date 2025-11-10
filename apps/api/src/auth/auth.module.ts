import { Module } from '@nestjs/common';

import { SERVICES } from '../utils/constants';

import { AuthService } from './services/auth.service';
import { UserModule } from 'src/user/user.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [UserModule, CryptoModule],
  providers: [
    {
      provide: SERVICES.AUTH,
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: SERVICES.AUTH,
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
