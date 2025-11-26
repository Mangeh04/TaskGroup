import { Body, Controller, Get, Inject, Patch } from '@nestjs/common';
import { Status } from '@repo/database';

import { User } from 'src/auth/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { SERVICES } from 'src/utils/constants';

import type {
  IUserService,
  UserConfiguration,
} from '../interfaces/user.interface';
import { UpdatePreferenceDto } from '../dtos/userPreference.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(SERVICES.USER) private readonly userService: IUserService,
  ) {}

  @Get('profile')
  async getProfile(@User() user: JwtPayload) {
    const userConfiguration = await this.userService.getUserConfiguration(
      user.sub,
    );

    (userConfiguration as any).status = userConfiguration.user.status;
    // We fetched everything in a query and the frontend expect it as status, this is much better DX.
    delete (userConfiguration as any).user;

    return {
      ...user,
      ...userConfiguration,
    };
  }

  @Patch('preference')
  async updatePreference(
    @Body() updatePreference: UpdatePreferenceDto,
    @User() user: JwtPayload,
  ) {
    return this.userService.updateUserConfiguration(
      user.sub,
      updatePreference as unknown as UserConfiguration,
    );
  }
}
