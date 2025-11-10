import { Module } from '@nestjs/common';
import { CryptoService } from '../crypto/services/crypto.service';
import { SERVICES } from '../utils/constants';

@Module({
  providers: [
    {
      provide: SERVICES.CRYPTO,
      useClass: CryptoService,
    },
  ],
  exports: [
    {
      provide: SERVICES.CRYPTO,
      useClass: CryptoService,
    },
  ],
})
export class AuthModule {}
