import { Module } from '@nestjs/common';
import { BusinessEventService } from './business-event.service';
import { BusinessEventController } from './business-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEvent } from './entities/business-event.entity';
import { Business } from 'src/scraper/entities/business.entity';
import { TwitterModule } from 'src/twitter/twitter.module';

@Module({
  imports: [
    TwitterModule,
    TypeOrmModule.forFeature([BusinessEvent, Business])
  ],
  controllers: [BusinessEventController],
  providers: [BusinessEventService]
})
export class BusinessEventModule {}
