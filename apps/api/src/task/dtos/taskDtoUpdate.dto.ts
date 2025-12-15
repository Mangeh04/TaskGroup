import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
  IsDateString,
} from 'class-validator';

import { State, Priority } from '@repo/database';

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
  @IsEnum(State, {
    message: `state must be one of the following values: ${Object.values(State).join(', ')}`,
  })
  state: State;

  @IsNotEmpty()
  @IsEnum(Priority, {
    message: `priority must be one of the following values: ${Object.values(Priority).join(', ')}`,
  })
  priority: Priority;

  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;

  @IsNotEmpty()
  @IsDateString()
  initialDate: Date;
}
