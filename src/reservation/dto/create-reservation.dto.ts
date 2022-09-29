import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { StatusType } from './custom-types';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'bob@gmail.com',
    type: String,
    description: 'user email name',
  })
  readonly email: string;

  @IsString()
  @ApiProperty({ example: 'bob', type: String, description: 'user name' })
  readonly userName: string;

  @IsString()
  @ApiProperty({
    example: 'September 8, 2023',
    type: String,
    description: 'reservation date',
  })
  readonly date: string;

  @IsString()
  @ApiProperty({
    example: '06:00 PM',
    type: String,
    description: 'reservation time',
  })
  @ApiProperty({ type: String, description: 'reservation time' })
  readonly time: string;

  @IsString()
  @IsIn(['confirmed', 'declined', 'pending'])
  @ApiProperty({
    example: 'confirmed',
    type: 'StatusType',
    description: 'reservation status',
  })
  status?: StatusType;
}
