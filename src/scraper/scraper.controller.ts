
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetBusinessDto } from './dto/get-business.dto';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }
  scrapeBusinessData(@Param('city') city: string): Promise<GetBusinessDto[]> {
    return this.scraperService.scrapeBusinessData(city);
  }

  @Get()
  getBusinesses(@Query('city') city: string): Promise<GetBusinessDto[]> {
    return this.scraperService.getBusinesses(city)
  }
}
