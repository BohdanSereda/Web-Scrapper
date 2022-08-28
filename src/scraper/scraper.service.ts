import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';
import { ScraperHelper } from './helpers/scraper.helper';

@Injectable()
export class ScraperService {
     scrapePage = async (url: string): Promise<string> => {
        try {
            let { data } = await axios.get(url);
            return data
        } catch (error) {
            console.error(error.message)
        }
    }
    getBusinessLinks(pageHtml: string): string[] {
        const $ = load(pageHtml);
        const scrapeHelper = new ScraperHelper($)
        return scrapeHelper.scrapeLinks()
    }
    extractBusinessPageInformation(businessPageHtml: string){
        const $: CheerioAPI = load(businessPageHtml);
        const scrapeHelper = new ScraperHelper($)

        const name: string= scrapeHelper.scrapeName();
        const description: string= scrapeHelper.scrapeDescription();
        const images: string[]= scrapeHelper.scrapeImages()
        const amenities: string[]= scrapeHelper.scrapeAmenities()
        const workingHours: string[] = scrapeHelper.scrapeWorkingHours()
        const address: string = scrapeHelper.scrapeAddress()
        const phone: string = scrapeHelper.scrapePhone()

        const lowest_rated_review = $('.comment__09f24__gu0rG').find('span').first().text()

        const rating: number = scrapeHelper.scrapeRating()

        return {
            name,
            description,
            images,
            address,
            phone,
            rating,
            lowest_rated_review,
            amenities,
            workingHours
        }
    }
    timer = (ms: number) => new Promise(r => setTimeout(r, ms))
    async scrapeBusinessData(city: string) {
        let businessesLinks = []

        for (let i = 0; i < 10; i += 10) {
            console.log(i);
            const link = 'https://www.yelp.com/search?find_desc=Restaurants&find_loc='+ city + '&start=' + i
            const businessListPageHtml = await this.scrapePage(link)
            businessesLinks = businessesLinks.concat(this.getBusinessLinks(businessListPageHtml))
        }
        const businessesData = []
        for (const businessesLink of businessesLinks) {
            const businessPageHtml = await this.scrapePage('https://www.yelp.com' + businessesLink + '?sort_by=rating_desc')
            await this.timer(500)
            businessesData.push(this.extractBusinessPageInformation(businessPageHtml))
        }
        return businessesData
    }
}
