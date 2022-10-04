import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class ScrapeBusinessDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'London',
        type: String,
        description: 'business city',
    })
    readonly city: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: 'bob@gmail.com',
        type: String,
        description: 'user email',
    })
    readonly email: string;
}
