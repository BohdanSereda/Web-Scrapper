import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { StatusType } from '../dto/custom-types';

@Entity()
export class Reservation {
  @ApiProperty({ example: 1, type: Number, description: 'reservation id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'bob@gmail.com',
    type: String,
    description: 'user email',
  })
  @Column()
  email: string;

  @ApiProperty({ example: 'bob', type: String, description: 'user name' })
  @Column()
  userName: string;

  @ApiProperty({
    example: 'September 8, 2023',
    type: String,
    description: 'reservation date',
  })
  @Column()
  date: string;

  @ApiProperty({
    example: '06:00 PM',
    type: String,
    description: 'reservation time',
  })
  @Column()
  time: string;

  @ApiProperty({
    example: 'confirmed',
    type: String,
    description: 'reservation status',
  })
  @Column()
  status: StatusType;
}
