import { Body, Controller, FileTypeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { BusinessEventService } from './business-event.service';
import { CreateBusinessEventDto } from './dto/create-business-event.dto';
import { fileFilter } from './dto/custom-types';

@Controller('business-event')
export class BusinessEventController {
  constructor(private readonly businessEventService: BusinessEventService) {}
  
  @Post()
  @UseInterceptors(FileInterceptor('image',{
    storage: diskStorage({
      destination: './images',
      filename: (req, file, cb) =>{
        const fileExtension: string = path.extname(file.originalname);
        const fileName: string = uuidv4() + fileExtension
        cb(null, fileName)
      }
    })
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        event_start: { type: 'integer' },
        event_end : {type: 'string'},
        description : {type: 'string'},
        image: {
          type: 'string',
          format: 'binary',
        },
        features : {type: 'string'},
        frequency: {type: 'string'},
        businessId: {type: 'number'}
      },
    },
  })
  @ApiResponse({status: 201, description: `Create new event. 
  \nATTENTION: 
  \nfrequency should be  "daily " or "weekly" or "" it determines frequency of event "" - one time event 
  \nevent_start example: 13.09.2022:9:00
  \nevent_end example: 13.09.2022:13:30` })
  @ApiResponse({ status: 400, description: 'bad request.'})
  @ApiResponse({ status: 500, description: 'internal server error.'})
  createEvent(
    @Body() createBusinessEventDto: CreateBusinessEventDto, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({fileType: fileFilter})
        ]
      })
    )
    image){
    return this.businessEventService.createEvent(createBusinessEventDto, image)
  }
}
