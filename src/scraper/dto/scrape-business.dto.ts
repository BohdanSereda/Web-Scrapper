import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
export class ScrapeBusinessDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'business city'})
    readonly city: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({type: String, description: 'user email'})
    readonly email: string;
}