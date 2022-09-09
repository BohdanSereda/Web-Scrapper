import { Module } from '@nestjs/common';
import { BusinessEventService } from './business-event.service';
import { BusinessEventController } from './business-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEvent } from './entities/business-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessEvent])],
  controllers: [BusinessEventController],
  providers: [BusinessEventService]
})
export class BusinessEventModule {}
