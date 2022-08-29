import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CheerioAPI, load } from 'cheerio';
import { info } from 'console';
import { Repository } from 'typeorm';
import { GetBusinessDto } from './dto/get-business.dto';
import { Business } from './entities/business.entity';
import { DataBaseHelper } from './helpers/db.helper';
import { InformationScraperHelper } from './helpers/information-scraper.helper';
import { PageScraperHelper } from './helpers/page-scraper.helper'

@Injectable()
export class ScraperService {
    constructor(
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>
    ){}

    getBusinessLinks(pageHtml: string): string[] {
        const $ = load(pageHtml);
        const informationScraperHelper = new InformationScraperHelper($)
        return informationScraperHelper.scrapeLinks()
    }
    extractBusinessPageInformation = async (businessPageHtml: string, businessLink: string) => {
        const $: CheerioAPI = load(businessPageHtml);
        const informationScraperHelper = new InformationScraperHelper($)

        const name: string = informationScraperHelper.scrapeName();
        const description: string = informationScraperHelper.scrapeDescription();
        const images: string[] = informationScraperHelper.scrapeImages()
        const amenities: string[] = informationScraperHelper.scrapeAmenities()
        const workingHours: string[] = informationScraperHelper.scrapeWorkingHours()
        const address: string = informationScraperHelper.scrapeAddress()
        const phone: string = informationScraperHelper.scrapePhone()
        const rating: number = informationScraperHelper.scrapeRating()
        const lowest_rated_review: string = informationScraperHelper.scrapeLowestRatedReview()
        const highest_rated_review: string = await informationScraperHelper.scrapeHighestRatedReview(businessLink)
        return {
            name,
            description,
            images,
            address,
            phone,
            rating,
            lowest_rated_review,
            highest_rated_review,
            amenities,
            workingHours
        }
    }

    async scrapeBusinessData(city: string): Promise<GetBusinessDto[]> {
        console.time('performance')
        let businessesLinks = []
        const pageScraperHelper = new PageScraperHelper()

        for (let i = 0; i < 50; i += 10) {
            const link = 'https://www.yelp.com/search?find_desc=Restaurants&find_loc=' + city + '&start=' + i
            const businessListPageHtml = await pageScraperHelper.scrapePage(link)
            businessesLinks = businessesLinks.concat(this.getBusinessLinks(businessListPageHtml))
        }
        const businessesData = []
        for (const businessesLink of businessesLinks) {
            const businessLink = 'https://www.yelp.com' + businessesLink + '&sort_by=rating_asc'
            const businessPageHtml = await pageScraperHelper.scrapePage(businessLink)
            await pageScraperHelper.timer(500)
            const business = await this.extractBusinessPageInformation(businessPageHtml, businessLink)
            const savedBusiness = await DataBaseHelper.createUniqueBusiness(business, this.businessRepository)
            if(!savedBusiness){
                continue
            }else{
                businessesData.push(savedBusiness)
            }
        }
        console.timeEnd('performance')
        return businessesData
    }
}
