import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @Matches('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$')
  phone: string;

  @IsEmail()
  email: string;
  @MinLength(5)
  password: string;
}

export class SigninDto {
  @IsEmail()
  email: string;
  @MinLength(5)
  password: string;
}
