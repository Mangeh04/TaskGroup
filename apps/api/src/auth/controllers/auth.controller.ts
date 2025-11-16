import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { SignInDto } from 'src/user/dtos/signIn';
import { SERVICES } from 'src/utils/constants';
import { SignUpDto } from 'src/user/dtos/signUp';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(SERVICES.AUTH) private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(
      signUpDto.alias,
      signUpDto.email,
      signUpDto.password,
    );
  }
}
