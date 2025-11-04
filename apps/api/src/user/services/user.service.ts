import { Injectable, Inject, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma, User } from '@repo/database';

import { IUserService } from '../interfaces/user.interface';
import { SERVICES } from 'src/utils/constants';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
    ) { }

    public async createUser(user: User) {
        try {
            await this.prismaService.user.create({ data: user });
            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2002':
                        throw new ConflictException('User already exists');
                    default:
                        throw new InternalServerErrorException();
                }
            }
            throw new InternalServerErrorException();
        }
    }

    public async findUser(userId: string) {
        try {
            return await this.prismaService.user.findUnique({ where: { id: userId } }) as unknown as Promise<User>;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    public async deleteUser(userId: string) {
        try {
            await this.prismaService.user.delete({ where: { id: userId } });
            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new ConflictException('Usuario no encontrado');
            }
            throw new InternalServerErrorException('Error al eliminar usuario');
        }
    }

    public async updateUser(user: User) {
        try {
            await this.prismaService.user.update({
                where: { id: user.id },
                data: user,
            });
            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('User not found');
            }
            throw new InternalServerErrorException();
        }
    }
}
