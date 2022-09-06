import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
    status: 'pending' | 'confirmed' | 'declined'

}