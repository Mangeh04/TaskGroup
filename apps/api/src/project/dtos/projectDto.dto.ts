import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ProjectCategory } from '@repo/database';
import { PROJECT_DTO_ERROR_CODES } from 'src/utils/constants';

export class ProjectDto {
  @IsNotEmpty({ message: PROJECT_DTO_ERROR_CODES.REQUIRED_NAME })
  @IsString({ message: PROJECT_DTO_ERROR_CODES.INVALID_NAME })
  @MaxLength(30, { message: PROJECT_DTO_ERROR_CODES.NAME_TOO_LONG })
  name: string;

  @IsOptional()
  @IsString({ message: PROJECT_DTO_ERROR_CODES.INVALID_DESCRIPTION })
  @MaxLength(120, { message: PROJECT_DTO_ERROR_CODES.DESCRIPTION_TOO_LONG })
  description?: string;

  @IsNotEmpty({ message: PROJECT_DTO_ERROR_CODES.REQUIRED_CATEGORY })
  @IsEnum(ProjectCategory, {
    message: PROJECT_DTO_ERROR_CODES.INVALID_CATEGORY,
  })
  category: ProjectCategory;
}
