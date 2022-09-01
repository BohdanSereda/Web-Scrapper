import { CheerioAPI, Element, load } from "cheerio";
import { PageScraperHelper } from './page-scraper.helper'
import { TimerHelper } from "./timer.helper";

export class InformationScraperHelper {
    $: CheerioAPI;
    constructor($: CheerioAPI) {
        this.$ = $
    }

    scrapeLinks = (): string[] => {
        const links: string[] = []
        this.$('a.css-1m051bw')
            .filter((i, el: Element) => /^\/biz\//.test(this.$(el).attr('href')))
            .each((i, el: Element) => {
                links.push(this.$(el).attr('href'))
            })
        return links
    }


    scrapeName = (): string => {
        return this.$('div[data-testid="photoHeader"]').find('h1').text().trim()
    }

    scrapeDescription = (): string => {
        return this.$('div.margin-b1-5__09f24__NHcQi').find('p.css-1evauet').text()
    }

    scrapeImages = (): string[] => {
        const images: string[] = []
        this.$('.carousel__09f24__HJrqN').find('div').each((i, el: Element) => {
            const img = this.$(el).find('img').attr('src')
            if (img && !images.includes(img)) {
                images.push(img)
            }
        })
        return images.slice(0, 3)
    }

    scrapeWorkingHours = (): string[] => {
        const workingHours: string[] = []
        this.$('table').find('tr').each((i, el: Element) => {
            const day = this.$(el).find('p').text().replace(/(.{3})/, '$1 ')
            if (day) {
                workingHours.push(day)
            }
        })
        return workingHours
    }

    scrapeAmenities = (): string[] => {
        return this.$('.arrange__09f24__LDfbs').find('span.css-1p9ibgf').text().split(' ')
    }

    scrapeAddress = (): string => {
        const addressData: string[] = []
        this.$('address').find('p').each((i, el: Element) => {
            addressData.push(this.$(el).text().trim())
        })
        return addressData.join(', ');
    }

    scrapeRating = (): number => {
        const headerHtml = this.$('div[data-testid="photoHeader"]').html();

        const startIndx = headerHtml.indexOf('aria-label="') + 'aria-label="'.length;

        return Number(headerHtml.slice(startIndx, startIndx + 1)) || 0;
    }

    scrapePhone = (): string => {
        let phone: string = ''
        this.$('p.css-1p9ibgf')
            .filter((i, el: Element) => /[1-9]{1}[0-9]{3,14}$/.test(this.$(el).text()))
            .each((i, el: Element) => {
                phone = phone.concat(this.$(el).text().trim())
            })
        return phone
    }

    scrapeLowestRatedReview = (): string => {
        return this.$('.comment__09f24__gu0rG').find('span').first().text()
    }

    scrapeHighestRatedReview = async (businessLink: string): Promise<string> => {
        const pageScraperHelper = new PageScraperHelper()
        const businessPageLinkSortedByDesc = businessLink.substring(0, businessLink.length - 4) + '&desc'
        TimerHelper.timer(2000)
        const businessPageHtmlSortedByDesc = await pageScraperHelper.scrapePage(businessPageLinkSortedByDesc)
        const $$ = load(businessPageHtmlSortedByDesc)
        return $$('.comment__09f24__gu0rG').find('span').first().text()
    }

    extractBusinessPageInformation = async (businessLink: string, city: string) => {
        const name: string = this.scrapeName();
        const description: string = this.scrapeDescription();
        const images: string[] = this.scrapeImages()
        const amenities: string[] = this.scrapeAmenities()
        const workingHours: string[] = this.scrapeWorkingHours()
        const address: string = this.scrapeAddress()
        const phone: string = this.scrapePhone()
        const rating: number = this.scrapeRating()
        const lowest_rated_review: string = this.scrapeLowestRatedReview()
        const highest_rated_review: string = await this.scrapeHighestRatedReview(businessLink)
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
            workingHours,
            city: city.toLowerCase()
        }
    }
}