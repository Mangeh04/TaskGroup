import { Module } from '@nestjs/common';
import { CryptoService } from './services/crypto.service';
import { SERVICES } from 'src/utils/constants';

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
export class CryptoModule {}
