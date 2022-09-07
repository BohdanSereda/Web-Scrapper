import { MailerService } from "@nestjs-modules/mailer";
import { CreateReservationDto } from "../reservation/dto/create-reservation.dto";


export class EmailHelper {
    async sendReservationEmail(mailerService: MailerService, updateReservation: CreateReservationDto) {
        const templates = {
            confirmed: `Your reservation was confirmed\nDate: ${updateReservation.date}.\nTime: ${updateReservation.time}`,
            declined: `Your reservation was declined\nDate: ${updateReservation.date}.\nTime: ${updateReservation.time}`
        }
        const from = 'scraper.api.study@gmail.com'
        const subject = "Reservation"
        await this.sendEmail(mailerService, from, subject, updateReservation.email, templates[updateReservation.status])
    }

    async sendEmail(mailerService: MailerService, from: string, subject: string, to: string, text: string) {
        await mailerService.sendMail({ to, from, subject, text })
    }
}