import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaExceptionFilter } from './prisma-exception/prisma-exception.filter';
import { CryptoModule } from './crypto/crypto.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { envSchema } from './config/env.schema';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { DecryptResponseInterceptor } from './crypto/interceptors/decrypt-reponse.interceptor';
import { AuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    CryptoModule,
    AuthModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      validationSchema: envSchema,
      isGlobal: true,
      validatePredefined: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
        },
      }),
      inject: [ConfigService],
    }),
    ProjectModule,
    TaskModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DecryptResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
