import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ProjectDto } from './projectDto.dto';

export class ProjectDtoUpdate extends ProjectDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  id: string;
}
