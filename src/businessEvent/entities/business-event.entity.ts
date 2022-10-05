import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { FrequencyType } from '../dto/custom-types';

@Entity()
export class BusinessEvent {
    @ApiProperty({ example: 1, type: Number, description: 'business event id' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'party',
        type: String,
        description: 'business event name',
    })
    @Column()
    name: string;

    @ApiProperty({
        example: '13.09.2022:9:00',
        type: String,
        description: 'business event start',
    })
    @Column()
    event_start: string;

    @ApiProperty({
        example: '13.09.2022:14:00',
        type: String,
        description: 'business event end',
    })
    @Column()
    event_end: string;

    @ApiProperty({
        example: 'very cool party',
        type: String,
        description: 'business event description',
    })
    @Column('longtext')
    description: string;

    @ApiProperty({
        example: 'no alcohol',
        type: String,
        description: 'business event features',
    })
    @Column()
    features: string;

    @ApiProperty({
        example: 'daily',
        type: 'FrequencyType',
        description: 'business event frequency',
    })
    @Column()
    frequency: FrequencyType;

    @ApiProperty({
        example: 250,
        type: Number,
        description: 'business event visitors count',
    })
    @Column()
    visitorsCount: number;

    @ApiProperty({ example: 14, type: Number, description: 'business id' })
    @Column()
    businessId: number;
}
