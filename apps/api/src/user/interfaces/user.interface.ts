import { User } from '@repo/database';

export interface IUserService {
  createUser(user: Pick<User, 'email' | 'alias' | 'password'>): Promise<User>;
  findUser(userId: string): Promise<User>;
  findUserByEmail(emailPlain: string): Promise<User>;
  deleteUser(userId: string): Promise<boolean>;
  updateUser(user: User): Promise<boolean>;
}
