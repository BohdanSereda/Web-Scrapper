import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateReservationDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string

    @IsString()
    readonly userName: string

    @IsString()
    readonly date: string

    @IsString()
    readonly time: string

    @IsString()
    readonly status?: 'pending' | 'confirmed' | 'declined'
}
