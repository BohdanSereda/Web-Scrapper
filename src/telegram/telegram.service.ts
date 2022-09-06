import { Injectable } from '@nestjs/common';
import { Context } from './helpers/telegram.context';
import { DataBaseHelper } from '../helpers/db.helper';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from '../scraper/entities/business.entity';
@Injectable()
export class TelegramService {
    constructor(        
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,){}

    async showCities(ctx: Context){
        const cities = await DataBaseHelper.getCities(this.businessRepository)
        const reply = cities.map((city: string, index)=> `${index + 1}. ${city}`).join('\n')
        await ctx.reply(reply)
    }  

    async showRestaurants(ctx: Context, message: string){
        const rawRestaurants = await DataBaseHelper.getBusinessesByCity(message, this.businessRepository)
        if(!rawRestaurants.length){
          ctx.reply('I don\'t know about this city 😥')
        }else{
          const reply = rawRestaurants.map((restaurant, index)=>`${index + 1}. ${restaurant.name}`).join('\n')
          ctx.reply(reply)
        }
    }

    async showWorkingHours(ctx: Context, message: string){
        const restaurant = (await DataBaseHelper.getRestaurant(message, this.businessRepository))
        if(!restaurant){
            ctx.reply('I don\'t know about this restaurant 😥') 
        }else{
            const reply = restaurant.workingHours.map((day, index)=>`${index + 1}. ${day}`).join('\n')
            ctx.reply(reply)
        }     
    }

    async reserveRestaurant(ctx: Context, message: string){
        const restaurant = await DataBaseHelper.getRestaurant(message, this.businessRepository)
        if(!restaurant){
            ctx.reply('I don\'t know about this restaurant 😥') 
        }else{
            ctx.reply('Choose day (in formate Mon, Tue, Wed....)')
            ctx.session.type = 'Reserve Day'
            ctx.session.restaurant = restaurant
        }
    }

    async reserveDay(ctx: Context, message: string){
        const workingHours = ctx.session.restaurant.workingHours
        console.log(ctx.session.restaurant);
        ctx.reply('Choose time')
        ctx.session.type = 'Reserve Working Hours'
    }
}
