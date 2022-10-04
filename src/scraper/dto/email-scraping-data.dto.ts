import { IsEmail, IsNumber, IsString } from 'class-validator';

export class EmailScrapingDataDto {
    @IsString()
    from: string;

    @IsString()
    subject: string;

    @IsString()
    city: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    status: string;

    @IsNumber()
    businessesCount: number;
}
