import { IsNotEmpty, IsString, MaxLength, IsBoolean } from 'class-validator';

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(120)
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  projectId: string;

  @IsString()
  @MaxLength(36)
  assignedUserId?: string;
}
