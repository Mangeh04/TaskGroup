import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Mode, Status } from '@repo/database';

export class UpdatePreferenceDto {
  @IsOptional()
  @IsEnum(Mode, {
    message: `Mode must be one of the following values: ${Object.values(Mode).join(', ')}`,
  })
  mode: Mode;

  @IsOptional()
  @IsEnum(Status, {
    message: `Status must be one of the following values: ${Object.values(Status).join(', ')}`,
  })
  status: Status;

  @IsOptional()
  @IsBoolean()
  notifications: Boolean;
}
