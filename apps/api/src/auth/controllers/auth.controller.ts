import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { AuthService } from '../services/auth.service';
import { SignInDto } from 'src/user/dtos/signIn';
import { SERVICES } from 'src/utils/constants';
import { SignUpDto } from 'src/user/dtos/signUp';

import { Public } from '../decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { SkipDecrypt } from 'src/crypto/decorators/skip-deccrypt.decorator';

const expirationTime = 1_000 * 60 * 60 * 24 * 7; // 7 days.

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(SERVICES.AUTH) private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @SkipDecrypt()
  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    this.mutateCookie(res, accessToken);

    return {
      message: 'Logged in successfully',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @SkipDecrypt()
  @Post('sign-up')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUp(
      signUpDto.alias,
      signUpDto.email,
      signUpDto.password,
    );

    this.mutateCookie(res, accessToken);

    return {
      message: 'Account created successfully',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully' };
  }

  private mutateCookie(res: Response, accesToken: string) {
    res.cookie('access_token', accesToken, {
      httpOnly: true,
      secure: false, // this should be (this.configService.get('NODE_ENV') === 'production') but since it's for education purposes we'll keep it like this.
      sameSite: 'lax',
      maxAge: expirationTime,
    });
  }
}
