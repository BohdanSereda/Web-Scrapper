import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class GetBusinessDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'business name'})
    readonly name: string;

    @IsString()
    @ApiProperty({type: String, description: 'business description'})
    readonly description: string;

    @IsArray()
    @IsString()
    @ApiProperty({type: Array, description: 'business first 3 images'})
    readonly images: string[];

    @IsString()
    @ApiProperty({type: String, description: 'business address'})
    readonly address: string;

    @IsString()
    @ApiProperty({type: String, description: 'business phone'})
    readonly phone: string;

    @IsNumber()
    @ApiProperty({type: Number, description: 'business rating'})
    readonly rating: number;

    @IsString()
    @ApiProperty({type: String, description: 'business  lowest rated review'})
    readonly lowest_rated_review: string;

    @IsString()
    @ApiProperty({type: String, description: 'business  highest rated review'})
    readonly highest_rated_review: string;

    @IsArray()
    @IsString()
    @ApiProperty({type: Array, description: 'business  amenities'})
    readonly amenities: string[];

    @IsArray()
    @IsString()
    @ApiProperty({type: Array, description: 'business  workingHours'})
    readonly workingHours: string[];

    @IsString()
    @ApiProperty({type: Array, description: 'business  city'})
    readonly city: string;
}
