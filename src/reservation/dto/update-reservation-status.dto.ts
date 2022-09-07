import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator'
import { StatusType } from './custom-types';

export class UpdateReservationsStatusDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: "StatusType", description: 'reservation status'})
    readonly status: StatusType
}