
import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GetBusinessDto } from './dto/get-business.dto';
import { scrapeBusinessDto } from './dto/scrape-business.dto';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }

  @Post()
  @ApiResponse({status: 200, description: 'Scrape business data from first 5 pages and post unique data in data base', type: String })
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  scrapeBusinessData(@Body() body: scrapeBusinessDto, @Res() res) {
    res.send({message:'scraping in progress, you will be notified via email'});
    this.scraperService.scrapeBusinessData(body.city, body.email)
  }

  @Get()
  @ApiResponse({status: 200, description: 'Get all business data or by business city from data base',  type: [GetBusinessDto]})
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  getBusinesses(@Query('city') city: string): Promise<GetBusinessDto[]> {
    return this.scraperService.getBusinesses(city)
  }
}
