import { Injectable } from '@nestjs/common';
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
        return await BusinessEventValidator.dateValidation(createBusinessEventDto, this.businessEventRepository, this.businessRepository)
    }

    async getBusinessEvents(createBusinessEventDto: CreateBusinessEventDto){
        return DataBaseHelper.getBusinessEvents(createBusinessEventDto, this.businessEventRepository, this.businessRepository)
    }
}
