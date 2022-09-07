import { Injectable } from '@nestjs/common';
import { Context } from './helpers/telegram.context';
import { DataBaseHelper } from '../helpers/db.helper';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from '../scraper/entities/business.entity';
import * as moment from "moment";
import { TelegramBotValidator } from './helpers/validation.helper';
import { ReservationService } from 'src/reservation/reservation.service';
@Injectable()
export class TelegramService {
    constructor(        
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,
        private readonly reservationService: ReservationService){}

    async showCities(ctx: Context){
        const cities = await DataBaseHelper.getCities(this.businessRepository)
        const reply = cities.map((city: string, index)=> `${index + 1}. ${city}`).join('\n')
        await ctx.reply(reply + '\nYou can see restaurants by pressing the corresponding button')
        ctx.session.type = ''
    }  

    async showRestaurants(ctx: Context, message: string){
        const rawRestaurants = await DataBaseHelper.getBusinessesByCity(message, this.businessRepository)
        if(!rawRestaurants.length){
          return await ctx.reply('I don\'t know about this city 😥')
        }
        const reply = rawRestaurants.map((restaurant, index)=>`${index + 1}. ${restaurant.name}`).join('\n')
        await ctx.reply(reply + '\nYou can see working hours or reserve table by pressing the corresponding button')
        ctx.session.type = ''
    }

    async showWorkingHours(ctx: Context, message: string){
        const restaurant = (await DataBaseHelper.getRestaurant(message, this.businessRepository))
        if(!restaurant){
           return await ctx.reply('I don\'t know about this restaurant 😥') 
        }
        const reply = restaurant.workingHours.map((day, index)=>`${index + 1}. ${day}`).join('\n')
        await ctx.reply(reply + '\nYou can reserve table by pressing the corresponding button')
        ctx.session.type = ''
            
    }

    async reserveRestaurant(ctx: Context, message: string){
        const restaurant = await DataBaseHelper.getRestaurant(message, this.businessRepository)
        if(!restaurant){
            return await ctx.reply('I don\'t know about this restaurant 😥')   
        }
        if(!restaurant.workingHours.length){
            return await ctx.reply('This restaurant is closed')
        }
            await ctx.reply('Choose day in formate DD-MM-YYYY')
            ctx.session.restaurant = restaurant
            ctx.session.type = 'Reserve Day'
        
    }

    async reserveDay(ctx: Context, message: string){
        const workingHours = ctx.session.restaurant.workingHours
        const date = moment(message, "DD-MM-YYYY"); 
        const isValid = await TelegramBotValidator.dateValidation(date, ctx, workingHours)
        if(isValid){
            await ctx.reply('Choose time in formate HH:mm')
            ctx.session.date = date.format('LL').toString()
            ctx.session.type = 'Reserve Working Hours'
        }
    }

    async reserveWorkingHours(ctx: Context, message: string){
        const workingHours = ctx.session.restaurant.workingHours
        const time = moment(message, "hh:mm A"); 
        const isValid = await TelegramBotValidator.timeValidation(time, ctx, workingHours)
        if(isValid){
            await ctx.reply('Give me your email')
            ctx.session.time = time.format('hh:mm A').toString()
            ctx.session.type = 'Email Providing'
        }
    }

    async finishReservation(ctx: Context, email: string){
        const isValidEmail = TelegramBotValidator.validateEmail(email)
        
        if(!isValidEmail){
            await ctx.reply(email + ' is\'nt valid')
        }else{
            const date = ctx.session.date
            const time = ctx.session.time
            const userName = ctx.session.userName
            await this.reservationService.createReservation(email, date, time, userName)
            await ctx.reply('We will contact with you via email')
            ctx.session.type = ''
        }
    }
}
