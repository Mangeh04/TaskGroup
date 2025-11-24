import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '@repo/database';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(Status, {
    message: `Status must be one of the following values: ${Object.values(Status).join(', ')}`,
  })
  status: Status;
}
