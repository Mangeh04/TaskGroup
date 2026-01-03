import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Response } from 'express';

import { SignInDto } from 'src/user/dtos/signIn';
import { PasswordChangeDto } from 'src/user/dtos/password.dto';
import { RESPONSES, SERVICES } from 'src/utils/constants';
import { SignUpDto } from 'src/user/dtos/signUp';

import { Public } from '../decorators/public.decorator';
import { SkipDecrypt } from 'src/crypto/decorators/skip-deccrypt.decorator';
import type { IAuthService } from '../interfaces/auth.interface';
import { User } from '../decorators/user.decorator';
import type { JwtPayload } from '../types/jwt-payload.type';
import { AuthGuard } from '../guards/auth.guard';

const expirationTime = 1_000 * 60 * 60 * 24 * 7; // 7 days.

@Controller('auth')
export class AuthController {
  constructor(@Inject(SERVICES.AUTH) private authService: IAuthService) {}

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
      message: RESPONSES.REGISTER_SUCCESS,
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
      message: RESPONSES.REGISTER_SUCCESS,
    };
  }

  @HttpCode(HttpStatus.OK)
  @SkipDecrypt()
  @Post('changePassword')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() passwordChangeDto: PasswordChangeDto,
    @User() user: JwtPayload,
  ) {
    return await this.authService.changePassword(
      user.sub,
      passwordChangeDto.password,
      passwordChangeDto.new_password1,
      passwordChangeDto.new_password2,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('log-out')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: RESPONSES.LOGGED_OUT };
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
