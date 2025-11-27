import { IsNotEmpty, IsString, MaxLength, IsBoolean } from 'class-validator';

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  title: string;

  @IsString()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted: boolean;

  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsString()
  assignedUserId?: string;
}
