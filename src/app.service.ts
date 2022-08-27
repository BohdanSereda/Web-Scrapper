import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {load} from 'cheerio'

@Injectable()
export class AppService {
    async scrape(url: string) {
        try {
            console.log(url)
            let { data } = await axios.get(url);
            return data
        } catch (error) {
            console.error(error.message)
        }
    }
    getBusinessLinks(pageHtml){
        const $ = load(pageHtml);

        const links: string[] =[]
        $('a.css-1m051bw')
            .filter((i, el) => /^\/biz\//.test($(el).attr('href')))
            .each((i, el) =>{
                links.push($(el).attr('href'))
            })
        return links;
    }
    extractBusinessPageInformation(businessPageHtml){
        const $ = load(businessPageHtml);

        const name = $('div[data-testid="photoHeader"]').find('h1').text().trim();

        const description = $('div.margin-b1-5__09f24__NHcQi').find('p.css-1evauet').text();

        let images: string[] =[]
        $('.carousel__09f24__HJrqN').find('div').each((i, el)=>{
            const img = $(el).find('img').attr('src')
            if(img && !images.includes(img)){
                images.push(img)
            }
        })
        images = images.slice(0, 3)

        const amenities = $('.arrange__09f24__LDfbs').find('span.css-1p9ibgf').text().split(' ')

        const workingHours = []
        $('table').find('tr').each((i, el)=>{
            const day = $(el).find('p').text().replace(/(.{3})/, '$1 ')
            if(day){
                workingHours.push(day)
            }   
        })

        const addressData: string[]  = []
        $('address').find('p').each((i, el) =>{ 
            addressData.push($(el).text().trim())
        })
        const address = addressData.join(', ');
    
        let phone: string = ''
        $('p.css-1p9ibgf')
            .filter((i, el) => /[1-9]{1}[0-9]{3,14}$/.test($(el).text()))
            .each((i, el) =>{
               phone = phone.concat($(el).text().trim())
            })

        console.log(phone)
        const lowest_rated_review = $('.comment__09f24__gu0rG').find('span').first().text()

        let rating: number = 0;
        const headerHtml = $('div[data-testid="photoHeader"]').html();

        const startIndx = headerHtml.indexOf('aria-label="') + 'aria-label="'.length;

        rating = Number(headerHtml.slice(startIndx, startIndx + 1)) || 0;

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
    async getBusiness(city: string) {
        let businessesLinks = []

        for (let i = 0; i < 10; i += 10) {
            console.log(i);
            const link = 'https://www.yelp.com/search?find_desc=Restaurants&find_loc='+ city + '&start=' + i
            const businessListPageHtml = await this.scrape(link)
            businessesLinks = businessesLinks.concat(this.getBusinessLinks(businessListPageHtml))
        }
        const businessesData = []
        for (const businessesLink of businessesLinks) {
            const businessPageHtml = await this.scrape('https://www.yelp.com' + businessesLink + '?sort_by=rating_desc')
            await this.timer(500)
            businessesData.push(this.extractBusinessPageInformation(businessPageHtml))
        }
        return businessesData
    }
}
