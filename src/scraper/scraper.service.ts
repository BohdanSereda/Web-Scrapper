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
        console.time('performance')
        let businessesLinks = []
        const pageScraperHelper = new PageScraperHelper()
        try {
            const existBusinesses = await DataBaseHelper.getBusinessesByCity(city, this.businessRepository)

            if(existBusinesses.length){
                await EmailHelper.sendEmail(this.mailerService, email, `This city has been already scraped: ${city}`)
                return `This city has been already scraped: ${city}`
            }
            for (let i = 0; i < 50; i += 10) {
                console.time('links scraping')
                const link = 'https://www.yelp.com/search?find_desc=Restaurants&find_loc=' + city + '&start=' + i
                const businessListPageHtml = await pageScraperHelper.scrapePage(link)
                await TimerHelper.timer(10000)
                businessesLinks = businessesLinks.concat(this.getBusinessLinks(businessListPageHtml))
                console.timeEnd('links scraping')
            }
            const businessesData = []
            for (const businessesLink of businessesLinks) {
                console.time('business scraping')
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
                console.timeEnd('business scraping')
                if(!savedBusiness){
                    continue
                }else{
                    businessesData.push(savedBusiness)
                }
            }
            console.timeEnd('performance')
            console.log(`scraped ${businessesData.length} businesses, city: ${city}`);
            await EmailHelper.sendEmail(this.mailerService, email, `Successfully scraped ${businessesData.length} businesses, city: ${city}`)
            return 'done'
        } catch (error) {
            await EmailHelper.sendEmail(this.mailerService, email, `Scraping error: something went wrong :(`)
            console.error(error)  
        }

    }

    async getBusinesses(city: string){
        return await DataBaseHelper.getBusinesses(city, this.businessRepository)
    }
}
