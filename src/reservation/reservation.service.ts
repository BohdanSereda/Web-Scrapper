import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    async updateReservationsStatus(id: string, updateReservationsStatus: UpdateReservationsStatusDto){
        const status = updateReservationsStatus.status
        if(status !== 'confirmed' && status !== 'declined' && status !== 'pending'){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'incorrect status value status field must have values: "pending", "declined", "confirmed"',
            }, HttpStatus.BAD_REQUEST)
        }
        const updateReservation = await DataBaseHelper.updateReservationsStatus(id, updateReservationsStatus, this.reservationRepository)
        if(updateReservation){
            await EmailHelper.sendEmail(this.mailerService, updateReservation)
            return updateReservation
        }else{
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'can\'t find reservation',
            }, HttpStatus.NOT_FOUND)

        }
    }
}
