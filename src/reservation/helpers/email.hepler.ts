import { MailerService } from "@nestjs-modules/mailer";
import { CreateReservationDto } from "../dto/create-reservation.dto";

export class EmailHelper{
    static async sendEmail(mailerService: MailerService, updateReservation: CreateReservationDto){
        let text = ''

        if(updateReservation.status === 'confirmed'){
            text = `Your reservation was confirmed\nDate: ${updateReservation.date}.\nTime: ${updateReservation.time}`
        }else if(updateReservation.status === 'declined'){
            text = `Your reservation was declined\nDate: ${updateReservation.date}.\nTime: ${updateReservation.time}`
        }else {
            return
        }
        await mailerService.sendMail({
            to: updateReservation.email,
            from: 'scraper.api.study@gmail.com',
            subject: 'Reservation',
            text
        })
    }
}