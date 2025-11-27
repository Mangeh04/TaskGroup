import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsBoolean,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

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

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  userIds: string[];
}
