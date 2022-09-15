import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataBaseHelper } from 'src/helpers/db.helper';
import { Business } from 'src/scraper/entities/business.entity';
import { TwitterService } from 'src/twitter/twitter.service';
import { Repository } from 'typeorm';
import { CreateBusinessEventDto } from './dto/create-business-event.dto';
import { BusinessEvent } from './entities/business-event.entity';
import { BusinessEventValidator } from './helpers/validation.helper';

@Injectable()
export class BusinessEventService {
    constructor(
        @InjectRepository(BusinessEvent)
        private readonly businessEventRepository: Repository<BusinessEvent>,
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,
        private readonly twitterService: TwitterService
    ) { }

    async createEvent(createBusinessEventDto: CreateBusinessEventDto, image: Express.Multer.File): Promise<false | BusinessEvent> {
        try {
            const validationResponse = await BusinessEventValidator.dateValidation(
                createBusinessEventDto,
                this.businessEventRepository,
                this.businessRepository)
            if (typeof validationResponse === 'string') {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `bad request: ${validationResponse}`,
                }, HttpStatus.BAD_REQUEST)
            }
            await this.twitterService.postTweet(createBusinessEventDto, image)
            return await DataBaseHelper.createUniqueBusinessEvents(createBusinessEventDto, this.businessEventRepository, this.businessRepository)
        } catch (error) {
            throw new HttpException({
                status: error.response.status,
                error: error.response.error,
            }, error.response.status)
        }

    }

    async incrementUserCounter(businessEventId: string) {
        const businessEvent = await DataBaseHelper.incrementBusinessEventUserCounter(businessEventId, this.businessEventRepository)
        if(!businessEvent){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `no event with id: ${businessEventId}`,
            }, HttpStatus.NOT_FOUND)
        }
        return businessEvent
    }
}
