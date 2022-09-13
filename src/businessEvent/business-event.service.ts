import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataBaseHelper } from 'src/helpers/db.helper';
import { Business } from 'src/scraper/entities/business.entity';
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
    ) { }

    async createEvent(createBusinessEventDto: CreateBusinessEventDto) {
        try {
            const validationResponse = await BusinessEventValidator.dateValidation(createBusinessEventDto, this.businessEventRepository, this.businessRepository)
            if (typeof validationResponse === 'string') {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `bad request: ${validationResponse}`,
                }, HttpStatus.BAD_REQUEST)
            }
            return validationResponse
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `internal server error.`,
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    async getBusinessEvents(createBusinessEventDto: CreateBusinessEventDto){
        return DataBaseHelper.getBusinessEvents(createBusinessEventDto, this.businessEventRepository, this.businessRepository)
    }
}
