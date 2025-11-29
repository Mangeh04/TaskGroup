import { Module } from '@nestjs/common';
import { DecryptService } from './services/decrypt.service';
import { SERVICES } from 'src/utils/constants';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [CryptoModule],
  providers: [
    {
      provide: SERVICES.DECRYPT,
      useClass: DecryptService,
    },
  ],
  exports: [SERVICES.DECRYPT],
})
export class DecryptModule {}
