import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class TaskDtoUpdate {
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  id: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  assignedUserId?: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted?: boolean;
}
