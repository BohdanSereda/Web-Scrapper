import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    type: Number,
    description: 'business id',
  })
  id: number;

  @Column()
  @ApiProperty({
    example: 'new business',
    type: String,
    description: 'business name',
  })
  name: string;

  @Column('longtext', { nullable: true })
  @ApiProperty({
    example: 'very cool place',
    type: String,
    description: 'business description',
  })
  description: string;

  @Column('simple-array')
  @ApiProperty({
    example: [
      'https://s3-media0.fl.yelpcdn.com/bphoto/BDTRkfVSJ8hoAT0amAfwkw/l.jpg',
      'https://s3-media0.fl.yelpcdn.com/bphoto/OFRbkp4GAe3-Ca9zUHkGAg/l.jpg',
      'https://s3-media0.fl.yelpcdn.com/bphoto/OGBqEyboylsdLqZ0Rpr1Sg/l.jpg',
    ],
    type: [String],
    description: 'business images',
  })
  images: string[];

  @Column()
  @ApiProperty({
    example: '14 North Audley Street, London W1K 6WE, United Kingdom',
    type: String,
    description: 'business address',
  })
  address: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: '380734343043',
    type: String,
    description: 'business phone',
  })
  phone: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: 5,
    type: Number,
    description: 'business rating',
  })
  rating: number;

  @Column('longtext')
  @Column({ nullable: true })
  @ApiProperty({
    example: 'I don`t recommend',
    type: String,
    description: 'business lowest rated review',
  })
  lowest_rated_review: string;

  @Column('longtext')
  @Column({ nullable: true })
  @ApiProperty({
    example: 'I recommend',
    type: String,
    description: 'business highest rated review',
  })
  highest_rated_review: string;

  @Column('simple-array')
  @ApiProperty({
    example: ['Takes', 'ReservationsVegan', 'Options'],
    type: [String],
    description: 'business amenities',
  })
  amenities: string[];

  @Column('simple-array')
  @ApiProperty({
    example: [
      'Mon 11:30 AM - 10:00 PM',
      'Tue 11:30 AM - 10:00 PM',
      'Wed 11:30 AM - 10:30 PM',
      'Thu 11:30 AM - 10:30 PM',
      'Fri 11:30 AM - 10:00 PM',
      'Sat 11:30 AM - 10:30 PM',
      'Sun 12:00 PM - 10:00 PM',
    ],
    type: [String],
    description: 'business workingHours',
  })
  workingHours: string[];

  @ApiProperty({
    example: 'London',
    type: String,
    description: 'business workingHours',
  })
  @Column()
  city: string;
}
