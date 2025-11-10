import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, type User } from '@repo/database';

import { IUserService } from '../interfaces/user.interface';
import { SERVICES } from 'src/utils/constants';
import { CryptoService } from 'src/crypto/services/crypto.service';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
    @Inject(SERVICES.CRYPTO) private readonly cryptoService: CryptoService,
  ) {}

  private async prepareDataForSaving(user: User): Promise<User> {
    const emailBi = this.cryptoService.blindIndexEmail(user.email);

    const [encryptedAlias, encryptedEmail, hashedPassword] = await Promise.all([
      this.cryptoService.encrypt(user.alias),
      this.cryptoService.encrypt(user.email),
      this.cryptoService.hash(user.password),
    ]);

    user.email = encryptedEmail.ciphertext;
    user.emailIv = encryptedEmail.iv;
    user.emailBi = emailBi;

    user.alias = encryptedAlias.ciphertext;
    user.aliasIv = encryptedAlias.iv;
    user.password = hashedPassword;

    return user;
  }

  public async createUser(user: User) {
    const data = await this.prepareDataForSaving(user);
    await this.prismaService.user.create({ data });
    return true;
  }

  public async findUser(userId: string) {
    return (await this.prismaService.user.findUnique({
      where: { id: userId },
    })) as unknown as Promise<User>;
  }

  public async deleteUser(userId: string) {
    await this.prismaService.user.delete({ where: { id: userId } });
    return true;
  }

  public async updateUser(user: User) {
    const data = await this.prepareDataForSaving(user);
    await this.prismaService.user.update({ where: { id: user.id }, data });
    return true;
  }

  public async findUserByEmail(emailPlain: string) {
    const emailBi = this.cryptoService.blindIndexEmail(emailPlain);
    const user = await this.prismaService.user.findUnique({
      where: { emailBi },
    });
    return user as unknown as Promise<User>;
  }
}
