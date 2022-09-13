import { Business } from '../../scraper/entities/business.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FrequencyType } from '../dto/custom-types';

@Entity()
export class BusinessEvent{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    event_start: string

    @Column()
    event_end: string

    @Column("longtext")
    description: string

    @Column()
    image: string 

    @Column()
    features: string

    @Column()
    frequency: FrequencyType

    @Column()
    visitorsCount: number

    @Column()
    businessId: number;
}