import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScrapeBusinessDto } from './dto/scrape-business.dto';
import { TimerHelper } from './helpers/timer.helper';
import { ScraperService } from './scraper.service';
import { Response } from 'express';
import { Business } from './entities/business.entity';

@ApiTags('Scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post()
  @ApiOperation({ summary: 'Business data scraping' })
  @ApiResponse({
    status: 201,
    description:
      'Scrape business data from first 5 pages and post unique data in data base',
    type: [Business],
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async scrapeBusinessData(
    @Body() scrapeBusinessDto: ScrapeBusinessDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await Promise.race([
      this.scraperService.scrapeBusinessData(scrapeBusinessDto),
      TimerHelper.raceTimer(false, 6000),
    ]);
    if (!result) {
      return res.send({
        message: 'scraping in progress, you will be notified via email',
      });
    }
    return res.send({ message: result });
  }

  @Get()
  @ApiOperation({ summary: 'Business data finding' })
  @ApiQuery({
    name: 'city',
    required: false,
    example: 'London',
  })
  @ApiResponse({
    status: 200,
    description: 'Get all business data or by business city from data base',
    type: [Business],
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getBusinesses(@Query('city') city: string): Promise<Business[]> {
    return this.scraperService.getBusinesses(city);
  }
}
