import { Role } from '@repo/database';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class MemberDto {
  @IsNotEmpty()
  @IsEnum(Role, {
    message: `Role must be one of the following values: ${Object.values(Role).join(', ')}`,
  })
  role: Role;
}
