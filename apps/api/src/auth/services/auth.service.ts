import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { IUserService } from 'src/user/interfaces/user.interface';
import { SERVICES } from 'src/utils/constants';
import { IAuthService, type Payload } from '../interfaces/auth.interface';
import type {
  EncryptedField,
  ICryptoService,
} from 'src/crypto/interfaces/crypto.interface';
import type { User } from '@repo/database';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(SERVICES.USER) private readonly usersService: IUserService,
    @Inject(SERVICES.CRYPTO) private readonly cryptoService: ICryptoService,
    private jwtService: JwtService,
  ) {}

  public async signIn(email: string, pass: string): Promise<Payload> {
    const user = await this.getUser(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await this.cryptoService.compareHash(pass, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, alias: user.alias };
    return {
      access_token: `Bearer ${await this.jwtService.signAsync(payload)}`,
    };
  }

  public async singUp(
    alias: string,
    email: string,
    password: string,
  ): Promise<Payload> {
    const user = await this.getUser(email);
    if (user) {
      throw new ConflictException();
    }

    const createdUser = await this.usersService.createUser({
      alias,
      email,
      password,
    });

    const payload = { sub: createdUser.id, alias: createdUser.alias };

    return {
      access_token: `Bearer ${await this.jwtService.signAsync(payload)}`,
    };
  }

  private async getUser(email: string): Promise<User> {
    const user = await this.usersService.findUserByEmail(email);
    return user;
  }
}
