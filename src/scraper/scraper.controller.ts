import { Controller, Get, Param, Post } from '@nestjs/common';
import { GetBusinessDto } from './dto/get-business.dto';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }
  @Post('/:city')
  scrap(@Param('city') city: string): Promise<GetBusinessDto[]> {
    return this.scraperService.scrapeBusinessData(city);
  }

  
}
