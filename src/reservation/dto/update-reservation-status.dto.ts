import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateReservationsStatusDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'reservation status'})
    readonly status: 'pending'| 'confirmed' | 'declined' 
}