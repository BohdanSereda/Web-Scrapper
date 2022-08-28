import { Controller, Get, Param } from '@nestjs/common';
import { GetBusinessDto } from './dto/get-business.dto';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }
  @Get('/:city')
  getHello(@Param('city') city: string): Promise<GetBusinessDto[]> {
    return this.scraperService.scrapeBusinessData(city);
  }
}
