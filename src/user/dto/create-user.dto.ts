import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsOptional} from "class-validator";

export class CreateUserDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}
