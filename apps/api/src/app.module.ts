import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/services/prisma.service';
import { UserService } from './user/services/user.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaExceptionFilter } from './prisma-exception/prisma-exception.filter';
import { CryptoService } from './crypto/services/crypto.service';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [UserModule, PrismaModule, CryptoModule],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    UserService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter
    },
    CryptoService
  ],
})
export class AppModule { }
