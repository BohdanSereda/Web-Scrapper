import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CheerioAPI, load } from 'cheerio';
import { Repository } from 'typeorm';
import { GetBusinessDto } from './dto/get-business.dto';

import { Business } from './entities/business.entity';
import { DataBaseHelper } from '../helpers/db.helper';
import { EmailHelper } from '../helpers/email.helper';
import { InformationScraperHelper } from './helpers/information-scraper.helper';
import { PageScraperHelper } from './helpers/page-scraper.helper'
import { TimerHelper } from './helpers/timer.helper';

@Injectable()
export class ScraperService {
    constructor(
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,
        private readonly mailerService: MailerService
    ){}

    getBusinessLinks(pageHtml: string): string[] {
        const $ = load(pageHtml);
        const informationScraperHelper = new InformationScraperHelper($)
        return informationScraperHelper.scrapeLinks()
    }

    async scrapeBusinessData(city: string, email: string): Promise<string> {
        console.time('performance time')
        const businessesLinks = []
        const businessesData = []
        const emailHelper = new EmailHelper()
        const emailTemplates = {
            scrapingError: `Scraping error: something went wrong :(\nBefore error scraped: ${businessesData.length} businesses, city: ${city}`,
            scrapingExistingCity: `This city has been already scraped: ${city}`,
            success:  `Successfully scraped: ${businessesData.length} businesses, city: ${city}`
        }
        const pageScraperHelper = new PageScraperHelper()
        try {
            const existBusinesses = await DataBaseHelper.getBusinessesByCity(city, this.businessRepository)

            if(existBusinesses.length){
                await emailHelper.sendEmail(this.mailerService, 'scraper.api.study@gmail.com', 'Scraping', email, emailTemplates.scrapingExistingCity)
                return `This city has been already scraped: ${city}`
            }
            for (let i = 0; i < 50; i += 10) {
                console.time('links scraping time')
                const link = 'https://www.yelp.com/search?find_desc=Restaurants&find_loc=' + city + '&start=' + i
                const businessListPageHtml = await pageScraperHelper.scrapePage(link)
                await TimerHelper.timer(15000)
                businessesLinks.push(...this.getBusinessLinks(businessListPageHtml))
                console.timeEnd('links scraping time')
            }

            for (const businessesLink of businessesLinks) {
                console.time('business scraping time')
                const businessLink = 'https://www.yelp.com' + businessesLink + '&sort_by=rating_asc'
                const businessPageHtml = await pageScraperHelper.scrapePage(businessLink)
                await TimerHelper.timer(17000)
                const $: CheerioAPI = load(businessPageHtml);
                const informationScraperHelper = new InformationScraperHelper($)
                const business: GetBusinessDto = await informationScraperHelper.extractBusinessPageInformation(businessLink, city)
                if(!business){
                    continue
                }
                const savedBusiness = await DataBaseHelper.createUniqueBusiness(business, this.businessRepository)
                console.timeEnd('business scraping time')
                if(!savedBusiness){
                    continue
                }else{
                    businessesData.push(savedBusiness)
                }
            }
            console.timeEnd('performance time')
            console.log(`scraped ${businessesData.length} businesses, city: ${city}`);

            await emailHelper.sendEmail(this.mailerService, 'scraper.api.study@gmail.com', 'Scraping', email, emailTemplates.success)
            return 'done'
        } catch (error) {
            await emailHelper.sendEmail(this.mailerService, 'scraper.api.study@gmail.com', 'Scraping', email, emailTemplates.scrapingError)
            console.error(error)  
        }

    }

    async getBusinesses(city: string){
        return await DataBaseHelper.getBusinesses(city, this.businessRepository)
    }
}
