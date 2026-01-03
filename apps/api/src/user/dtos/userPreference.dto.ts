import { Theme, Status } from '@repo/database';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { USER_DTO_ERROR_CODES } from '../../utils/constants';

export class UpdatePreferenceDto {
  @IsOptional()
  @IsEnum(Theme, {
    message: USER_DTO_ERROR_CODES.THEME_ENUM,
  })
  theme?: Theme;

  @IsOptional()
  @IsEnum(Status, {
    message: USER_DTO_ERROR_CODES.STATUS_ENUM,
  })
  status?: Status;

  @IsOptional()
  @IsBoolean({
    message: USER_DTO_ERROR_CODES.IS_BOOLEAN,
  })
  notifications?: Boolean;

  @IsOptional()
  @IsString({
    message: USER_DTO_ERROR_CODES.IS_STRING,
  })
  language?: String;
}
