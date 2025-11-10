import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { IUserService } from 'src/user/interfaces/user.interface';
import { SERVICES } from 'src/utils/constants';
import { IAuthService, type Payload } from '../interfaces/auth.interface';
import type { ICryptoService } from 'src/crypto/interfaces/crypto.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(SERVICES.USER) private usersService: IUserService,
    @Inject(SERVICES.CRYPTO) private cryptoService: ICryptoService,
    private jwtService: JwtService,
  ) {}

  public async signIn(email: string, pass: string): Promise<Payload> {
    const user = await this.usersService.findUserByEmail(email);
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
}
