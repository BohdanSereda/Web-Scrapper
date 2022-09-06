
import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GetBusinessDto } from './dto/get-business.dto';
import { scrapeBusinessDto } from './dto/scrape-business.dto';
import { TimerHelper } from './helpers/timer.helper';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }

  @Post()
  @ApiResponse({status: 201, description: 'Scrape business data from first 5 pages and post unique data in data base'})
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  async scrapeBusinessData(@Body() body: scrapeBusinessDto, @Res() res) {
    const result = await Promise.race([
      this.scraperService.scrapeBusinessData(body.city, body.email),
      TimerHelper.raceTimer(false, 6000)
    ])
    if(!result){
      res.send({message:'scraping in progress, you will be notified via email'});
    }
    if(result){
      res.send({message: result});
    }
  }

  @Get()
  @ApiResponse({status: 200, description: 'Get all business data or by business city from data base',  type: [GetBusinessDto]})
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  getBusinesses(@Query('city') city: string): Promise<GetBusinessDto[]> {
    return this.scraperService.getBusinesses(city)
  }
}
