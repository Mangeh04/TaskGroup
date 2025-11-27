import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaskDtoUpdate {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  assignedUserId?: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted?: boolean;
}
