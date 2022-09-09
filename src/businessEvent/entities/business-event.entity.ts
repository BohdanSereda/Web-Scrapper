import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class BusinessEvent{
    @PrimaryGeneratedColumn()
    id: number

}