import { MailerService } from '@nestjs-modules/mailer';
import { EmailScrapingDataDto } from '../scraper/dto/email-scraping-data.dto';
import { CreateReservationDto } from '../reservation/dto/create-reservation.dto';

export class EmailHelper {
    async sendReservationEmail(
        mailerService: MailerService,
        updateReservation: CreateReservationDto,
    ): Promise<void> {
        const templates = {
            confirmed: `Your reservation was confirmed\nDate: ${updateReservation.date}.\nTime: ${updateReservation.time}`,
            declined: `Your reservation was declined\nDate: ${updateReservation.date}.\nTime: ${updateReservation.time}`,
        };
        const from = 'scraper.api.study@gmail.com';
        const subject = 'Reservation';
        await this.sendEmail(
            mailerService,
            from,
            subject,
            updateReservation.email,
            templates[updateReservation.status],
        );
    }

    async sendScrapingResultEmail(
        mailerService: MailerService,
        emailData: EmailScrapingDataDto,
    ): Promise<void> {
        const templates = {
            scrapingError: `Scraping error: something went wrong :(\nBefore error scraped: ${emailData.businessesCount} businesses, city: ${emailData.city}`,
            scrapingExistingCity: `This city has been already scraped: ${emailData.city}`,
            success: `Successfully scraped: ${emailData.businessesCount} businesses, city: ${emailData.city}`,
        };
        await this.sendEmail(
            mailerService,
            emailData.from,
            emailData.subject,
            emailData.email,
            templates[emailData.status],
        );
    }

    async sendEmail(
        mailerService: MailerService,
        from: string,
        subject: string,
        to: string,
        text: string,
    ): Promise<void> {
        await mailerService.sendMail({ to, from, subject, text });
    }
}
