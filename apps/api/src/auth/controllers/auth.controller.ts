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
import { SignInDto } from 'src/user/dtos/signInDto.dto';
import { SERVICES } from 'src/utils/constants';

@Controller('auth')
export class AuthController {
  constructor(@Inject(SERVICES.AUTH) private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return null;
  }
}
