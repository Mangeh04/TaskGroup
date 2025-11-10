import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, type User } from '@repo/database';

import { IUserService } from '../interfaces/user.interface';
import { SERVICES } from 'src/utils/constants';
import { CryptoService } from 'src/crypto/services/crypto.service';
import { EncryptedField } from 'src/crypto/interfaces/crypto.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
    @Inject(SERVICES.CRYPTO) private readonly cryptoService: CryptoService,
  ) {}

  public async createUser(user: User) {
    const data = await this.prepareDataForSaving(user);
    await this.prismaService.user.create({ data });

    return true;
  }

  private async prepareDataForSaving(user: User): Promise<User> {
    const promises = [
      this.cryptoService.encrypt(user.alias),
      this.cryptoService.encrypt(user.email),
      this.cryptoService.hash(user.password),
    ];
    const [encryptedAlias, encryptedEmail, hashedPassword] =
      await Promise.all(promises);

    user.email = (encryptedEmail as EncryptedField).ciphertext;
    user.emailIv = (encryptedEmail as EncryptedField).iv;
    user.alias = (encryptedAlias as EncryptedField).ciphertext;
    user.aliasIv = (encryptedAlias as EncryptedField).iv;
    user.password = hashedPassword as string;

    return user;
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

    await this.prismaService.user.update({
      where: { id: user.id },
      data,
    });
    return true;
  }
}
