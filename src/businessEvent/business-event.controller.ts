import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { BusinessEventService } from './business-event.service';
import { CreateBusinessEventDto } from './dto/create-business-event.dto';
import { BusinessEvent } from './entities/business-event.entity';
import {
    apiBodySchema,
    fileInterceptorConfig,
    parseFile,
} from './helpers/api-post.helper';

@ApiTags('Business events')
@Controller('business-event')
export class BusinessEventController {
    constructor(private readonly businessEventService: BusinessEventService) {}

    @UseInterceptors(FileInterceptor('image', fileInterceptorConfig))
    @ApiConsumes('multipart/form-data')
    @ApiBody(apiBodySchema)
    @ApiOperation({ summary: 'Business event creation' })
    @ApiResponse({
        status: 201,
        description: `Create new event.`,
        type: BusinessEvent,
    })
    @ApiResponse({ status: 400, description: 'bad request.' })
    @ApiResponse({ status: 500, description: 'internal server error.' })
    @Post()
    async createEvent(
        @Body() createBusinessEventDto: CreateBusinessEventDto,
        @UploadedFile(parseFile)
        image: Express.Multer.File,
    ): Promise<false | BusinessEvent> {
        return this.businessEventService.createEvent(
            createBusinessEventDto,
            image,
        );
    }

    @ApiOperation({ summary: 'Increment user counter' })
    @ApiResponse({
        status: 201,
        description: `increment user counter.`,
        type: BusinessEvent,
    })
    @ApiResponse({ status: 404, description: 'not found.' })
    @ApiResponse({ status: 500, description: 'internal server error.' })
    @Patch(':id')
    async incrementUserCounter(
        @Param('id') businessEventId: string,
    ): Promise<BusinessEvent> {
        return this.businessEventService.incrementUserCounter(businessEventId);
    }
}
