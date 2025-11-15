import { Role } from '@repo/database';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}
