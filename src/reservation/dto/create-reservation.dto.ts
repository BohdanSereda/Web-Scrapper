import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateReservationDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({type: String, description: 'user email name'})
    readonly email: string

    @IsString()
    @ApiProperty({type: String, description: 'user name'})
    readonly userName: string

    @IsString()
    @ApiProperty({type: String, description: 'reservation date'})
    readonly date: string

    @IsString()
    @ApiProperty({type: String, description: 'reservation time'})
    readonly time: string

    @IsString()
    @ApiProperty({type: String, description: 'reservation status'})
    status?: 'pending' | 'confirmed' | 'declined'
}
