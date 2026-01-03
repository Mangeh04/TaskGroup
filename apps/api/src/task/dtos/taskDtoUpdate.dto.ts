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

export class TaskDtoUpdate {
  @IsNotEmpty({ message: TASK_DTO_ERROR_CODES.REQUIRED_ID })
  @IsString({ message: TASK_DTO_ERROR_CODES.INVALID_ID })
  @MaxLength(36, { message: TASK_DTO_ERROR_CODES.ID_TOO_LONG })
  id: string;

  @IsOptional()
  @IsString({ message: TASK_DTO_ERROR_CODES.INVALID_TITLE })
  @MaxLength(30, { message: TASK_DTO_ERROR_CODES.TITLE_TOO_LONG })
  title?: string;

  @IsOptional()
  @IsString({ message: TASK_DTO_ERROR_CODES.INVALID_DESCRIPTION })
  @MaxLength(120, { message: TASK_DTO_ERROR_CODES.DESCRIPTION_TOO_LONG })
  description?: string | null;

  @IsOptional()
  @IsString({ message: TASK_DTO_ERROR_CODES.INVALID_ASSIGNED_USER_ID })
  @MaxLength(36, { message: TASK_DTO_ERROR_CODES.ASSIGNED_USER_ID_TOO_LONG })
  assignedUserId?: string | null;

  @IsOptional()
  @IsEnum(State, { message: TASK_DTO_ERROR_CODES.INVALID_STATE })
  state?: State;

  @IsOptional()
  @IsEnum(Priority, { message: TASK_DTO_ERROR_CODES.INVALID_PRIORITY })
  priority?: Priority;

  @IsOptional()
  @IsDateString({}, { message: TASK_DTO_ERROR_CODES.INVALID_INITIAL_DATE })
  initialDate?: string;

  @IsOptional()
  @IsDateString({}, { message: TASK_DTO_ERROR_CODES.INVALID_DUE_DATE })
  @Validate(IsDueDateAfterInitialDate, {
    message: TASK_DTO_ERROR_CODES.DUE_DATE_BEFORE_INITIAL_DATE,
  })
  dueDate?: string;
}
