import * as moment from "moment";
import { Context } from "./telegram.context";

export class TelegramBotValidator{
    static async dateValidation(date: moment.Moment, ctx: Context, workingHours: string[]): Promise<boolean>{
        const today = moment().startOf('day')
        
        if(date.isValid() && date.isSameOrAfter(today)){
            const reservationDayIndex = date.day() - 1    
            const isClosed = workingHours[reservationDayIndex].includes('Closed')
            if(isClosed){
                await ctx.reply('This restaurant is closed for this date')
                return false
            }
            return true
        }else{
            ctx.reply('Invalid date')
            return false
        }
    }

    static async timeValidation(time: moment.Moment, ctx: Context, workingHours){
        if(time.isValid()){
            const reservationDayIndex =  moment(ctx.session.date).day() - 1 
            const splittedTime = workingHours[reservationDayIndex].split(' ')
            const start = moment(splittedTime[1] + ' ' + splittedTime[2], 'hh:mm A')
            let end
            if(workingHours[reservationDayIndex].includes('Next day')){
                end = moment(splittedTime[4] + ' ' +splittedTime[5].slice(0, 2), 'hh:mm A').add('days', 1);
            }else{
                end = moment(splittedTime[4] + ' ' +splittedTime[5].slice(0, 2), 'hh:mm A');
            }
            if(!time.isBetween(start, end)){
                await ctx.reply('This restaurant is closed for this date time')
                return false
            }
            return true
        }else{
            await ctx.reply('Time is invalid')
            return false
        }
    }
    static validateEmail = (email: string) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      };
}