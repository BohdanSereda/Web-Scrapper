import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { StatusType } from '../dto/custom-types';

@Entity()
export class Reservation{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    userName: string

    @Column()
    date: string

    @Column()
    time: string

    @Column()
    status: StatusType

}