import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { DataBaseHelper } from '../helpers/db.helper';
import { EmailHelper } from '../helpers/email.helper';
import { UpdateReservationsStatusDto } from './dto/update-reservation-status.dto';
@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        private readonly mailerService: MailerService
    ) { }

    async createReservation(email: string, date: string, time: string, userName: string) {
        return DataBaseHelper.createReservation({ email, date, time, userName }, this.reservationRepository)
    }

    async getAllPendingReservations() {
        return DataBaseHelper.getAllPendingReservations(this.reservationRepository)
    }

    async updateReservationsStatus(id: string, updateReservationsStatus: UpdateReservationsStatusDto) {
        const emailHelper = new EmailHelper()
        const updateReservation = await DataBaseHelper.updateReservationsStatus(id, updateReservationsStatus, this.reservationRepository)
        if (!updateReservation) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'bad request',
            }, HttpStatus.BAD_REQUEST)
        }
        await emailHelper.sendReservationEmail(this.mailerService, updateReservation)
        return updateReservation
    }
}
