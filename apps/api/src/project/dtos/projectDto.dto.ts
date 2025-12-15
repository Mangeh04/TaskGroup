import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';

import { ProjectCategory } from '@repo/database';

export class ProjectDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  @MaxLength(120)
  description: string;

  @IsNotEmpty()
  @IsEnum(ProjectCategory, {
    message: `projectCategory must be one of the following values: ${Object.values(ProjectCategory).join(', ')}`,
  })
  category: ProjectCategory;
}
