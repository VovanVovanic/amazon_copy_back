/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class AuthDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?:string

  @IsString()
  @MinLength(6, {
    message: "Password must be at least 6 characters long",
  })
  password: string;
}
