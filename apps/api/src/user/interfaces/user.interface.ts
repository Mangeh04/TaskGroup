import type { ProfileConfiguration, User, Status } from '@repo/database';

export type UserConfiguration = Omit<
  ProfileConfiguration & {
    user: {
      status: Status;
    };
  },
  'userId' | 'createdAt' | 'updatedAt'
>;

export type SanitaizedUser = Omit<
  User,
  'password' | 'emailBi' | 'createdAt' | 'updatedAt'
>;

export interface IUserService {
  createUser(user: Pick<User, 'email' | 'alias' | 'password'>): Promise<User>;
  findUser(userId: string): Promise<User>;
  findUserByEmail(emailPlain: string): Promise<User>;
  deleteUser(userId: string): Promise<boolean>;
  updateUser(user: User): Promise<boolean>;
  getUserConfiguration(userId: string): Promise<UserConfiguration>;
  updateUserConfiguration(
    userId: string,
    data: ProfileConfiguration,
  ): Promise<boolean>;
  updateUserPassword(userId: string, password: string): Promise<boolean>;
  updateStatus(userId: string, status: Status): Promise<boolean>;
}
