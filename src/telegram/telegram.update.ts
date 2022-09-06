import { Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { TelegramService } from './telegram.service';
import { ActionButtons } from './helpers/telegram.buttons';
import { DataBaseHelper } from '../helpers/db.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from '../scraper/entities/business.entity';
import { Repository } from 'typeorm';
import { Context } from './helpers/telegram.context';

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,  
    private readonly telegramService: TelegramService
    ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('hi', ActionButtons.renderButtons())
  }

  @Hears('Cities')
  async showCities(ctx: Context){
    this.telegramService.showCities(ctx)
  }

  @Hears('Restaurants')
  async getRestaurantsContext(ctx: Context){
    ctx.session.type = 'Restaurants'
    await ctx.reply('type city where you want to see available restaurants')
  }

  @Hears('Hours')
  async getWorkingHoursContext(ctx: Context){
    ctx.session.type = 'Working Hours'
    await ctx.reply('type restaurant where you want to see available working hours')
  }

  @Hears('Reserve')
  async getReserveContext(ctx: Context){
    ctx.session.type = 'Reserve Restaurants'
    await ctx.reply('type restaurant where you want to reserve a table')
  }
  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context){
    if(!ctx.session.type) return
    console.log(ctx.session.type); 
    switch(ctx.session.type){
      case 'Restaurants':
        this.telegramService.showRestaurants(ctx, message)
        break;
      case 'Working Hours':
        this.telegramService.showWorkingHours(ctx, message)
        break;
      case 'Reserve Restaurants':
        this.telegramService.reserveRestaurant(ctx, message)
        break;
      case 'Reserve Day':
         this.telegramService.reserveDay(ctx, message)
    }
  } 
}
