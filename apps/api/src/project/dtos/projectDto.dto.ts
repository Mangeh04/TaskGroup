import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  name: string;

  @IsString()
  @MaxLength(255)
  description: string;
}
