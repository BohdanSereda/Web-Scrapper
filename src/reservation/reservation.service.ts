import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import {DataBaseHelper} from '../helpers/db.helper';
import { EmailHelper } from './helpers/email.hepler';
import { UpdateReservationsStatusDto } from './dto/update-reservation-status.dto';
@Injectable()
export class ReservationService {
    constructor(        
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        private readonly mailerService: MailerService
        ){}

    async createReservation(email: string, date: string, time: string, userName: string){
       return DataBaseHelper.createReservation({email, date, time, userName}, this.reservationRepository)
    }

    async getAllPendingReservations(){
        return DataBaseHelper.getAllPendingReservations(this.reservationRepository)
    }

    async updateReservationsStatus(id: string, body: UpdateReservationsStatusDto){
        const updateReservation = await DataBaseHelper.updateReservationsStatus(id, body, this.reservationRepository)
        if(updateReservation){
            await EmailHelper.sendEmail(this.mailerService, updateReservation)
            return updateReservation
        }else{
            return {error:'can\'t find reservation'}
        }
    }
}
