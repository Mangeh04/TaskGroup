import { Role } from '@repo/database';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MEMBER_DTO_ERROR_CODES } from 'src/utils/constants';

export class MemberDto {
  @IsNotEmpty({ message: MEMBER_DTO_ERROR_CODES.REQUIRED_ROLE })
  @IsEnum(Role, { message: MEMBER_DTO_ERROR_CODES.INVALID_ROLE })
  role: Role;
}
