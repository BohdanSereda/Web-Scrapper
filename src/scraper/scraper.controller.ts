
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GetBusinessDto } from './dto/get-business.dto';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }

  @Post('/:city/:email')
  @ApiResponse({status: 200, description: 'Scrape business data from first 5 pages and post unique data in data base', type: [GetBusinessDto]})
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  scrapeBusinessData(@Param('city') city: string, @Param('email') email: string): Promise<GetBusinessDto[]> {
    return this.scraperService.scrapeBusinessData(city, email);
  }

  @Get()
  @ApiResponse({status: 200, description: 'Get all business data or by business city from data base',  type: [GetBusinessDto]})
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  getBusinesses(@Query('city') city: string): Promise<GetBusinessDto[]> {
    return this.scraperService.getBusinesses(city)
  }
}
