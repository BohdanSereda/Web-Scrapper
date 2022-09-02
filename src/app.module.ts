import { Module } from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TelegramModule } from './telegram/telegram.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    ScraperModule,
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    MailerModule.forRoot({
      transport:{
        host: process.env.MAILER_HOST,
        auth:{
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD
        }
      }
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: ["dist/**/*.entity.js"],
      synchronize: false,
      autoLoadEntities: true
    }),
    TelegramModule,
    ReservationModule]
})
export class AppModule {}
