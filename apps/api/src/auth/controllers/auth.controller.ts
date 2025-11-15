import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';
import { SignInDto } from 'src/user/dtos/signIn';
import { SERVICES } from 'src/utils/constants';
import { SignUpDto } from 'src/user/dtos/signUp';

@Controller('auth')
export class AuthController {
  constructor(@Inject(SERVICES.AUTH) private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.singUp(
      signUpDto.alias,
      signUpDto.email,
      signUpDto.password,
    );
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return null;
  }
}
