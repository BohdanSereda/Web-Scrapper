import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Business{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column("longtext", {nullable: true})
    description: string

    @Column("simple-array")
    images: string[]

    @Column()
    address: string

    @Column({nullable: true})
    phone: string

    @Column()
    rating: number

    @Column("longtext")
    lowest_rated_review: string

    @Column("longtext")
    highest_rated_review: string

    @Column("simple-array")
    amenities: string[]

    @Column("simple-array")
    workingHours: string[]

    @Column()
    city: string;
}