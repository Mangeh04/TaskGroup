import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@repo/database';

import type { IUserService } from 'src/user/interfaces/user.interface';
import { SERVICES } from 'src/utils/constants';
import { IAuthService, type Payload } from '../interfaces/auth.interface';
import type { ICryptoService } from 'src/crypto/interfaces/crypto.interface';

import type { JwtPayload } from '../types/jwt-payload.type';

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

    const payload: JwtPayload = { sub: user.id, alias: user.alias, email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  public async signUp(
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

    const payload: JwtPayload = {
      sub: createdUser.id,
      alias,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  public async changePassword(
    id: string,
    oldPassword: string,
    newPassword1: string,
    newPassword2: string,
  ) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const hashedOldPassword = await this.cryptoService.hash(oldPassword);

    if (
      await this.cryptoService.compareHash(user.password, hashedOldPassword)
    ) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (oldPassword === newPassword1) {
      throw new ConflictException(
        'New password must be different from the current password',
      );
    }

    if (newPassword1 !== newPassword2) {
      throw new ConflictException('New passwords do not match');
    }

    user.password = newPassword1;

    await this.usersService.updateUser(user);
    return true;
  }

  private async getUser(email: string): Promise<User | null> {
    let user = await this.usersService.findUserByEmail(email);

    if (!user) {
      return null;
    }

    user.alias = await this.cryptoService.decrypt({
      ciphertext: user.alias,
      iv: user.aliasIv,
    });

    return user;
  }

  private async getUserById(id: string): Promise<User | null> {
    let user = await this.usersService.findUser(id);

    if (!user) {
      return null;
    }

    user.alias = await this.cryptoService.decrypt({
      ciphertext: user.alias,
      iv: user.aliasIv,
    });

    return user;
  }
}
