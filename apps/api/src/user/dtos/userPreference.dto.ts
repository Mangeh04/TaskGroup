import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Theme, Status } from '@repo/database';

export class UpdatePreferenceDto {
  @IsOptional()
  @IsEnum(Theme, {
    message: `Mode must be one of the following values: ${Object.values(Theme).join(', ')}`,
  })
  theme?: Theme;

  @IsOptional()
  @IsEnum(Status, {
    message: `Status must be one of the following values: ${Object.values(Status).join(', ')}`,
  })
  status?: Status;

  @IsOptional()
  @IsBoolean()
  notifications?: Boolean;

  @IsString()
  @IsOptional()
  language?: String;
}
