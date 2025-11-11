import { IsNotEmpty, IsString } from 'class-validator';
import { TaskDto } from './taskDto.dto';

export class TaskDtoUpdate extends TaskDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
