import { Controller, Get, Inject, UseGuards } from '@nestjs/common';

import { User } from 'src/auth/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { SERVICES } from 'src/utils/constants';

import type { IUserService } from '../interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(
    @Inject(SERVICES.USER) private readonly userService: IUserService,
  ) {}

  @Get('profile')
  async getProfile(@User() user: JwtPayload) {
    return await this.userService.getUserConfiguration(user.sub);
  }
}
