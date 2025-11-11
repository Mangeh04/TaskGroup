import { IsNotEmpty, IsString } from 'class-validator';
import { ProjectDto } from './projectDto.dto';

export class ProjectDtoUpdate extends ProjectDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
