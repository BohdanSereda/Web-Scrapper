
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetBusinessDto } from './dto/get-business.dto';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }
  @Post('/:city/:email')
  scrapeBusinessData(@Param('city') city: string, @Param('email') email: string): Promise<GetBusinessDto[]> {
    return this.scraperService.scrapeBusinessData(city, email);
  }

  @Get()
  getBusinesses(@Query('city') city: string): Promise<GetBusinessDto[]> {
    return this.scraperService.getBusinesses(city)
  }
}
