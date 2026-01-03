import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '@repo/database';
import { USER_DTO_ERROR_CODES } from '../../utils/constants';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(Status, {
    message: USER_DTO_ERROR_CODES.STATUS_ENUM,
  })
  status: Status;
}
