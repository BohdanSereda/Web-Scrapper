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

    async createReservation(email: string, date: string, time: string, userName: string): Promise<Reservation> {
        return DataBaseHelper.createReservation({ email, date, time, userName }, this.reservationRepository)
    }

    async getAllPendingReservations(): Promise<Reservation[]> {
        return DataBaseHelper.getAllPendingReservations(this.reservationRepository)
    }

    async updateReservationsStatus(id: string, updateReservationsStatus: UpdateReservationsStatusDto): Promise<Reservation> {
        const emailHelper = new EmailHelper()
        const updateReservation = await DataBaseHelper.updateReservationsStatus(id, updateReservationsStatus, this.reservationRepository)
        if (!updateReservation) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `not found reservation with id: ${id}`,
            }, HttpStatus.NOT_FOUND)
        }
        await emailHelper.sendReservationEmail(this.mailerService, updateReservation)
        return updateReservation
    }
}
