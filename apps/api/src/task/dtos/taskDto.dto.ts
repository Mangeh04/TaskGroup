import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
  IsDateString,
  Validate,
} from 'class-validator';

import { State, Priority } from '@repo/database';
import { IsDueDateAfterInitialDate } from './validators/is-due-date-after-initial-date.validator';
import { TASK_DTO_ERROR_CODES } from 'src/utils/constants';

export class TaskDto {
  @IsNotEmpty({ message: TASK_DTO_ERROR_CODES.REQUIRED_TITLE })
  @IsString({ message: TASK_DTO_ERROR_CODES.INVALID_TITLE })
  @MaxLength(30, { message: TASK_DTO_ERROR_CODES.TITLE_TOO_LONG })
  title: string;

  @IsOptional()
  @IsString({ message: TASK_DTO_ERROR_CODES.INVALID_DESCRIPTION })
  @MaxLength(120, { message: TASK_DTO_ERROR_CODES.DESCRIPTION_TOO_LONG })
  description?: string;

  @IsNotEmpty({ message: TASK_DTO_ERROR_CODES.INVALID_STATE })
  @IsEnum(State, {
    message: TASK_DTO_ERROR_CODES.INVALID_STATE,
  })
  state: State;

  @IsNotEmpty({ message: TASK_DTO_ERROR_CODES.INVALID_PRIORITY })
  @IsEnum(Priority, {
    message: TASK_DTO_ERROR_CODES.INVALID_PRIORITY,
  })
  priority: Priority;

  @IsNotEmpty({ message: TASK_DTO_ERROR_CODES.REQUIRED_INITIAL_DATE })
  @IsDateString({}, { message: TASK_DTO_ERROR_CODES.INVALID_INITIAL_DATE })
  initialDate: string;

  @IsNotEmpty({ message: TASK_DTO_ERROR_CODES.REQUIRED_DUE_DATE })
  @IsDateString({}, { message: TASK_DTO_ERROR_CODES.INVALID_DUE_DATE })
  @Validate(IsDueDateAfterInitialDate, {
    message: TASK_DTO_ERROR_CODES.DUE_DATE_BEFORE_INITIAL_DATE,
  })
  dueDate: string;

  @IsNotEmpty({ message: TASK_DTO_ERROR_CODES.REQUIRED_PROJECT_ID })
  @IsString({ message: TASK_DTO_ERROR_CODES.INVALID_PROJECT_ID })
  @MaxLength(36, { message: TASK_DTO_ERROR_CODES.PROJECT_ID_TOO_LONG })
  projectId: string;

  @IsOptional()
  @IsString({ message: TASK_DTO_ERROR_CODES.INVALID_ASSIGNED_USER_ID })
  @MaxLength(36, { message: TASK_DTO_ERROR_CODES.ASSIGNED_USER_ID_TOO_LONG })
  assignedUserId?: string;
}
