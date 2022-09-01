import { MailerService } from "@nestjs-modules/mailer";

export class EmailHelper{
    static async sendEmail(mailerService: MailerService, email:string, text:string){
        await mailerService.sendMail({
            to: email,
            from: 'scraper.api.study@gmail.com',
            subject: 'Scraping',
            text
        })
    }
}