import { Repository } from "typeorm";
import { GetBusinessDto } from "../dto/get-business.dto";
import { Business } from "../entities/business.entity";


export class DataBaseHelper {
    static async createUniqueBusiness(business: GetBusinessDto, businessRepository: Repository<Business>){
        const existBusiness = await businessRepository.findOne({
            where: {
                name: business.name,
                city: business.city
            }
        })
        
        if(existBusiness){
            return false
        }

        const createdBusiness = businessRepository.create(business)
        return businessRepository.save(createdBusiness)
    }

    static async getBusinessesByCity(city: string, businessRepository: Repository<Business>){
         
        return await businessRepository.find({
            where: {
                city: city
            }
        })
  
    }

    static async getBusinesses(city: string, businessRepository: Repository<Business>){
        if (city) {            
            return await businessRepository.find({
                where: {
                    city: city
                }
            })
        } else {
            return await businessRepository.find()
        }
    }
}