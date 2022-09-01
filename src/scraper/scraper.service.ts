import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CheerioAPI, load } from 'cheerio';
import { Repository } from 'typeorm';
import { GetBusinessDto } from './dto/get-business.dto';

import { Business } from './entities/business.entity';
import { DataBaseHelper } from './helpers/db.helper';
import { EmailHelper } from './helpers/email.hepler';
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
        console.log(email, typeof email)
        console.time('performance')
        let businessesLinks = []
        const pageScraperHelper = new PageScraperHelper()
        try {
            for (let i = 0; i < 50; i += 10) {
                const link = 'https://www.yelp.com/search?find_desc=Restaurants&find_loc=' + city + '&start=' + i
                await TimerHelper.timer(5000)
                const businessListPageHtml = await pageScraperHelper.scrapePage(link)
                businessesLinks = businessesLinks.concat(this.getBusinessLinks(businessListPageHtml))
            }
            const businessesData = []
            for (const businessesLink of businessesLinks) {
                const businessLink = 'https://www.yelp.com' + businessesLink + '&sort_by=rating_asc'
                await TimerHelper.timer(5000)
                const businessPageHtml = await pageScraperHelper.scrapePage(businessLink)
                const $: CheerioAPI = load(businessPageHtml);
                const informationScraperHelper = new InformationScraperHelper($)
                const business: GetBusinessDto = await informationScraperHelper.extractBusinessPageInformation(businessLink, city)
                const savedBusiness = await DataBaseHelper.createUniqueBusiness(business, this.businessRepository)
                if(!savedBusiness){
                    continue
                }else{
                    businessesData.push(savedBusiness)
                }
            }
            console.timeEnd('performance')
            console.log(`scraped ${businessesData.length} businesses`);
            await EmailHelper.sendEmail(this.mailerService, email, `Successfully scraped ${businessesData.length} businesses`)
            return 'done'
        } catch (error) {
            console.error(error)
            await EmailHelper.sendEmail(this.mailerService, email, `Scraping error: something went wrong :(`)
        }

    }

    async getBusinesses(city: string){
        return await DataBaseHelper.getBusinesses(city, this.businessRepository)
    }
}
