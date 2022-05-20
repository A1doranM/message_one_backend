import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(16)
    @MinLength(8)
    password: string;
}