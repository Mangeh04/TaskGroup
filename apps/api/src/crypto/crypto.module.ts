import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CryptoService } from './services/crypto.service';
import { SERVICES } from 'src/utils/constants';

@Module({
  providers: [
    {
      provide: SERVICES.CRYPTO,
      // Workaround since there's a problem with the configService metadata
      useFactory: (configService: ConfigService) =>
        new CryptoService(configService),
      inject: [ConfigService],
    },
  ],
  exports: [SERVICES.CRYPTO],
})
export class CryptoModule {}
