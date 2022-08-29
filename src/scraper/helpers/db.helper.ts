import { Repository } from "typeorm";
import { GetBusinessDto } from "../dto/get-business.dto";
import { Business } from "../entities/business.entity";


export class DataBaseHelper {
    static async createUniqueBusiness(business: GetBusinessDto, businessRepository: Repository<Business>){
        const existBusiness = await businessRepository.findOne({
            where: {
                name: business.name
            }
        })
        
        if(existBusiness){
            return
        }

        const createdBusiness = businessRepository.create(business)
        return businessRepository.save(createdBusiness)
    }
}