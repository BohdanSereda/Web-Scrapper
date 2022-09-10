import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { StatusType } from '../dto/custom-types';

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
    frequency: StatusType
}