import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  @MaxLength(120)
  description: string;
}
