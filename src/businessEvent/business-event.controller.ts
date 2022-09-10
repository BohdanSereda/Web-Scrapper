import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BusinessEventService } from './business-event.service';
import { CreateBusinessEventDto } from './dto/create-business-event.dto';

@Controller('event')
export class BusinessEventController {
  constructor(private readonly businessEventService: BusinessEventService) {}
  
  @Post()
  @ApiResponse({status: 201, description: 'Create new event.' })
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  createEvent(@Body() createBusinessEventDto: CreateBusinessEventDto){
    return this.businessEventService.createEvent(createBusinessEventDto)
  }
}
