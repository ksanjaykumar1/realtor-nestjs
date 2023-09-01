import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
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

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productKey?: string;
}

export class SigninDto {
  @IsEmail()
  email: string;
  @MinLength(5)
  password: string;
}

export class GenerateProductDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
