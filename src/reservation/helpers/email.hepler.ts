import { MailerService } from "@nestjs-modules/mailer";

export class EmailHelper{
    static async sendEmail(mailerService: MailerService, email:string, status:string){
        let text = ''
        if(status === 'confirmed'){
            text = "your reservation was confirmed"
        }
        if(status === 'declined'){
            text = "your reservation was confirmed"
        }
        await mailerService.sendMail({
            to: email,
            from: 'scraper.api.study@gmail.com',
            subject: 'Reservation',
            text
        })
    }
}