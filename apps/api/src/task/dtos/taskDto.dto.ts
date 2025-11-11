import { IsNotEmpty, IsString, MaxLength, IsBoolean } from 'class-validator';

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  title: string;

  @IsString()
  @MaxLength(255)
  description: string;

  @IsBoolean()
  isCompleted: boolean;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  projectId: string;
}
