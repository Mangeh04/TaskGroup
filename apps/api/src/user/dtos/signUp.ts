import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { USER_DTO_ERROR_CODES } from '../../utils/constants';

export class SignUpDto {
  @IsNotEmpty({
    message: USER_DTO_ERROR_CODES.IS_NOT_EMPTY,
  })
  @IsString({
    message: USER_DTO_ERROR_CODES.IS_STRING,
  })
  @MaxLength(30, {
    message: USER_DTO_ERROR_CODES.ALIAS_TOO_LONG,
  })
  alias: string;

  @IsEmail({})
  @IsNotEmpty({
    message: USER_DTO_ERROR_CODES.IS_NOT_EMPTY,
  })
  @MaxLength(254, {
    message: USER_DTO_ERROR_CODES.EMAIL_TOO_LONG,
  })
  email: string;

  @IsNotEmpty({
    message: USER_DTO_ERROR_CODES.IS_NOT_EMPTY,
  })
  @IsString({
    message: USER_DTO_ERROR_CODES.IS_STRING,
  })
  @MinLength(8, {
    message: USER_DTO_ERROR_CODES.PASSWORD_TOO_SHORT,
  })
  @MaxLength(20, {
    message: USER_DTO_ERROR_CODES.PASSWORD_TOO_LONG,
  })
  password: string;
}
