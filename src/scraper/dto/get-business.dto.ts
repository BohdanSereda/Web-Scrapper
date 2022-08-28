import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class GetBusinessDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    readonly description: string;

    @IsArray()
    @IsString()
    readonly images: string[];

    @IsString()
    readonly address: string;

    @IsString()
    readonly phone: string;

    @IsNumber()
    readonly rating: number;

    @IsString()
    readonly lowest_rated_review: string;

    @IsString()
    readonly highest_rated_review: string;

    @IsArray()
    @IsString()
    readonly amenities: string[];

    @IsArray()
    @IsString()
    readonly workingHours: string[];
}
