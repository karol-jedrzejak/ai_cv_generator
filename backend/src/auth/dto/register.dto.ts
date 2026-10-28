import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  surname!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[+0-9().\s-]+$/)
  mobilePhone!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  hometown!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username!: string;

  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
