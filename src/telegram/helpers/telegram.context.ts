import { GetBusinessDto } from '../../scraper/dto/get-business.dto'
import {Context as ContextTelegraf} from 'telegraf' 
export interface Context extends ContextTelegraf{
    session:{
        type?: 'Restaurants' | 'Working Hours' | 'Reserve Restaurants' | 'Reserve Day' | 'Reserve Working Hours',
        restaurant: GetBusinessDto
    }
}