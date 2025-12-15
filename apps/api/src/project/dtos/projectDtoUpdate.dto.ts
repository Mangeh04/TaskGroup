import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProjectCategory } from '@repo/database';

export class ProjectDtoUpdate {
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  description: string;

  @IsOptional()
  @IsEnum(ProjectCategory, {
    message: `projectCategory must be one of the following values: ${Object.values(ProjectCategory).join(', ')}`,
  })
  category: ProjectCategory;
}
