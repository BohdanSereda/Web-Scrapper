import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import {DataBaseHelper} from '../helpers/db.helper';
import { EmailHelper } from './helpers/email.hepler';
@Injectable()
export class ReservationService {
    constructor(        
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        private readonly mailerService: MailerService
        ){}

    async createReservation(email: string, date: string, time: string, userName: string){
       return DataBaseHelper.createReservation({email, date, time, userName, status: 'pending'}, this.reservationRepository)
    }

    async getAllPendingReservations(){
        return DataBaseHelper.getAllPendingReservations(this.reservationRepository)
    }

    async updateReservationsStatus(id: string){
        const updateReservation = await DataBaseHelper.updateReservationsStatus(id, 'confirmed', this.reservationRepository)
        if(updateReservation){
            EmailHelper.sendEmail(this.mailerService, updateReservation.email, updateReservation.status)
        }
    }
}
