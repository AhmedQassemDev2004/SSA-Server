import {IsEmail, IsNotEmpty, MinLength, IsBoolean, IsOptional} from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    phone: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
