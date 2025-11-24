import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PasswordChangeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  new_password1: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  new_password2: string;
}
