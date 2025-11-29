import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordChangeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  new_password1: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  new_password2: string;
}
