import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsIn,
    IsNumber,
    IsOptional,
} from 'class-validator';
import { FrequencyType } from './custom-types';

export class CreateBusinessEventDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'party',
        type: String,
        description: 'business event name',
    })
    readonly name: string;

    @IsString()
    @ApiProperty({
        example: '13.09.2022:9:00',
        type: String,
        description: 'business event start',
    })
    readonly event_start: string;

    @IsString()
    @ApiProperty({
        example: '13.09.2022:14:00',
        type: String,
        description: 'business event end',
    })
    readonly event_end: string;

    @IsString()
    @ApiProperty({
        example: 'very cool party',
        type: String,
        description: 'business event description',
    })
    readonly description: string;

    @IsString()
    @ApiProperty({
        example: 'no alcohol',
        type: String,
        description: 'business event features',
    })
    readonly features: string;

    @IsString()
    @IsIn(['daily', 'weekly', ''])
    @ApiProperty({
        example: 'daily',
        type: 'FrequencyType',
        description: 'business event frequency',
    })
    frequency: FrequencyType;

    @IsNumber()
    @IsOptional()
    visitorsCount?: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 14, type: Number, description: 'business id' })
    readonly businessId: number;
}
