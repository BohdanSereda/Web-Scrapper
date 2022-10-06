import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { StatusType } from './custom-types';

export class UpdateReservationsStatusDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['confirmed', 'declined', 'pending'])
    @ApiProperty({ type: 'StatusType', description: 'reservation status' })
    readonly status: StatusType;
}
