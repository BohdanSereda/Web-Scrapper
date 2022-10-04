import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationModule } from 'src/reservation/reservation.module';
import { Business } from '../scraper/entities/business.entity';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';

@Module({
    imports: [ReservationModule, TypeOrmModule.forFeature([Business])],
    controllers: [],
    providers: [TelegramService, TelegramUpdate],
})
export class TelegramModule {}
