import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '../scraper/entities/business.entity';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update'

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  controllers: [],
  providers: [TelegramService, TelegramUpdate]
})
export class TelegramModule {}
