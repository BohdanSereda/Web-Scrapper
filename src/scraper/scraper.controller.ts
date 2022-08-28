import { Controller, Get, Param } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }
  @Get('/:city')
  getHello(@Param('city') city: string) {
    return this.scraperService.scrapeBusinessData(city);
  }
}
