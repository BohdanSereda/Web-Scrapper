import { Repository } from "typeorm";
import { GetBusinessDto } from "../scraper/dto/get-business.dto";
import { Business } from "../scraper/entities/business.entity";
import { CreateReservationDto } from "src/reservation/dto/create-reservation.dto";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { UpdateReservationsStatusDto } from "src/reservation/dto/update-reservation-status.dto";
import { BusinessEvent } from "src/businessEvent/entities/business-event.entity";
import { CreateBusinessEventDto } from "src/businessEvent/dto/create-business-event.dto";

export class DataBaseHelper {
    static async createUniqueBusiness(business: GetBusinessDto, businessRepository: Repository<Business>) {
        const existBusiness = await businessRepository.findOne({ where: { name: business.name, city: business.city } })
        if (existBusiness) {
            return false
        }
        const createdBusiness = businessRepository.create(business)
        return businessRepository.save(createdBusiness)
    }

    static async getBusinessesByCity(city: string, businessRepository: Repository<Business>) {
        return await businessRepository.find({ where: { city } })
    }

    static async getBusinessesByID(id: string, businessRepository: Repository<Business>) {
        return await businessRepository.findOneBy({id:+id})
    }

    static async getBusinesses(city: string, businessRepository: Repository<Business>) {
        const query = city ? { where: { city } } : {}
        return await businessRepository.find(query)
    }


    static async getCities(businessRepository: Repository<Business>) {
        const rawCities = await businessRepository.createQueryBuilder().select("city").groupBy('city').execute();
        return rawCities.map(rawCity => rawCity.city)
    }

    static async getRestaurant(restaurantName, businessRepository: Repository<Business>) {
        return await businessRepository.findOne({ where: { name: restaurantName } })
    }

    static async createReservation(reservation: CreateReservationDto, reservationRepository: Repository<Reservation>) {
        reservation.status = 'pending'
        const createdBusiness = reservationRepository.create(reservation)
        return reservationRepository.save(createdBusiness)
    }

    static async getAllPendingReservations(reservationRepository: Repository<Reservation>) {
        return await reservationRepository.find({ where: { status: 'pending' } })
    }

    static async updateReservationsStatus(id: string, updateReservationsStatus: UpdateReservationsStatusDto, reservationRepository: Repository<Reservation>) {
        const existingReservation = await reservationRepository.findOneBy({ id: +id })
        if (!existingReservation || existingReservation.status === updateReservationsStatus.status) {
            return false
        }
        existingReservation.status = updateReservationsStatus.status
        return await reservationRepository.save(existingReservation)
    }



    static async getBusinessEvents(businessEvent: CreateBusinessEventDto, businessEventRepository: Repository<BusinessEvent>, businessRepository: Repository<Business>){
        const business = await DataBaseHelper.getBusinessesByID(`${businessEvent.businessId}`, businessRepository )
        if(!business){
            return false
        }
        return await businessEventRepository.find({where:{businessId: businessEvent.businessId}})
    }

    static async createUniqueBusinessEvents(businessEvent: CreateBusinessEventDto, businessEventRepository: Repository<BusinessEvent>, businessRepository: Repository<Business>) {
        businessEvent.visitorsCount = 0
        const business = await DataBaseHelper.getBusinessesByID(`${businessEvent.businessId}`, businessRepository)        
        
        if(!business){
            return false
        }

        const createdBusinessEvent = businessEventRepository.create(businessEvent)
        return businessEventRepository.save(createdBusinessEvent)
    }
}