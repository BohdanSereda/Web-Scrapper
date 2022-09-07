import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator'
import { StatusType } from './custom-types';

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
    @IsIn(['confirmed', 'declined', 'pending'])
    @ApiProperty({type: "StatusType", description: 'reservation status'})
    status?: StatusType
}
