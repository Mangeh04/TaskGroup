import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProjectCategory } from '@repo/database';
import { PROJECT_DTO_ERROR_CODES } from 'src/utils/constants';

export class ProjectDtoUpdate {
  @IsNotEmpty({ message: PROJECT_DTO_ERROR_CODES.REQUIRED_ID })
  @IsString({ message: PROJECT_DTO_ERROR_CODES.INVALID_ID })
  @MaxLength(36, { message: PROJECT_DTO_ERROR_CODES.ID_TOO_LONG })
  id: string;

  @IsOptional()
  @IsString({ message: PROJECT_DTO_ERROR_CODES.INVALID_NAME })
  @MaxLength(30, { message: PROJECT_DTO_ERROR_CODES.NAME_TOO_LONG })
  name?: string;

  @IsOptional()
  @IsString({ message: PROJECT_DTO_ERROR_CODES.INVALID_DESCRIPTION })
  @MaxLength(120, { message: PROJECT_DTO_ERROR_CODES.DESCRIPTION_TOO_LONG })
  description?: string | null;

  @IsOptional()
  @IsEnum(ProjectCategory, {
    message: PROJECT_DTO_ERROR_CODES.INVALID_CATEGORY,
  })
  category?: ProjectCategory;
}
