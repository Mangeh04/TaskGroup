import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEnum,
  IsDateString,
  Validate,
} from 'class-validator';

import { State, Priority } from '@repo/database';
import { IsDueDateAfterInitialDate } from './validators/is-due-date-after-initial-date.validator';

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(120)
  description: string;

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
  @Validate(IsDueDateAfterInitialDate)
  dueDate: Date;

  @IsNotEmpty()
  @IsDateString()
  initialDate: Date;

  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  projectId: string;

  @IsString()
  @MaxLength(36)
  assignedUserId?: string;
}
