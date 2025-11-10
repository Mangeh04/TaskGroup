import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaExceptionFilter } from './prisma-exception/prisma-exception.filter';
import { CryptoModule } from './crypto/crypto.module';
import { AuthModule } from './auth/auth.module';
import { envSchema } from './config/env.schema';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    CryptoModule,
    AuthModule,
    ConfigModule.forRoot({
      cache: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      validationSchema: envSchema,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
