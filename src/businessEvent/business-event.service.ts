import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataBaseHelper } from 'src/helpers/db.helper';
import { Repository } from 'typeorm';
import { BusinessEvent } from './entities/business-event.entity';

@Injectable()
export class BusinessEventService {
    constructor(
        @InjectRepository(BusinessEvent)
        private readonly reservationRepository: Repository<BusinessEvent>,
    ) { }
    async createEvent() {
        return DataBaseHelper
    }
}
