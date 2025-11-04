import { User } from '@repo/database';

export interface IUserService {
    createUser(user: User): Promise<boolean>;
    findUser(userId: string): Promise<User>;
    deleteUser(userId: string): Promise<boolean>;
    updateUser(user: User): Promise<boolean>;
}