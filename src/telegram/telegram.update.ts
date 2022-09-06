import { Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { TelegramService } from './telegram.service';
import { ActionButtons } from './helpers/telegram.buttons';
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
    const userData = await ctx.getChatMember(ctx.chat.id)
    ctx.session.userName = userData.user.username
  }

  @Hears('Cities')
  async showCities(ctx: Context){
    this.telegramService.showCities(ctx)
  }

  @Hears('Restaurants')
  async getRestaurantsContext(ctx: Context){
    ctx.session.type = 'Restaurants'
    await ctx.reply('Type city name where you want to see available restaurants')
  }

  @Hears('Working Hours')
  async getWorkingHoursContext(ctx: Context){
    ctx.session.type = 'Working Hours'
    await ctx.reply('Type restaurant name where you want to see available working hours')
  }

  @Hears('Reserve')
  async getReserveContext(ctx: Context){
    ctx.session.type = 'Reserve Restaurants'
    await ctx.reply('Type restaurant name where you want to reserve a table')
  }
  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context){
    if(!ctx.session.type) return
    console.log(ctx.session.type); 
    switch(ctx.session.type){
      case 'Restaurants':
        await this.telegramService.showRestaurants(ctx, message)
        break;
      case 'Working Hours':
        await this.telegramService.showWorkingHours(ctx, message)
        break;
      case 'Reserve Restaurants':
        this.telegramService.reserveRestaurant(ctx, message)
        break;
      case 'Reserve Day':
        this.telegramService.reserveDay(ctx, message)
        break;
      case'Reserve Working Hours':
        this.telegramService.reserveWorkingHours(ctx, message)
        break;
      case 'Email Providing':
        this.telegramService.finishReservation(ctx, message)
        break
    }
  } 
}
