import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BusinessEventService } from './business-event.service';
import { CreateBusinessEventDto } from './dto/create-business-event.dto';

@Controller('business-event')
export class BusinessEventController {
  constructor(private readonly businessEventService: BusinessEventService) {}
  
  @Post()
  @ApiResponse({status: 201, description: `Create new event. 
  \nATTENTION: 
  \nfrequency should be  "daily " or "weekly" or "" it determines frequency of event "" - one time event 
  \nevent_start example: 13.09.2022:9:00
  \nevent_end example: 13.09.2022:13:30` })
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  createEvent(@Body() createBusinessEventDto: CreateBusinessEventDto){
    return this.businessEventService.createEvent(createBusinessEventDto)
  }
}
