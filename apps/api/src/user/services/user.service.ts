import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, type User } from '@repo/database';

import { IUserService } from '../interfaces/user.interface';
import { SERVICES } from 'src/utils/constants';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
  ) {}

  public async createUser(user: User) {
    await this.prismaService.user.create({ data: user });
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
    await this.prismaService.user.update({
      where: { id: user.id },
      data: user,
    });
    return true;
  }
}
