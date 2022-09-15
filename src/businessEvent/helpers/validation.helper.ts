import * as moment from "moment";
import { CreateBusinessEventDto } from "../dto/create-business-event.dto";
import { DataBaseHelper } from "src/helpers/db.helper";
import { Business } from "src/scraper/entities/business.entity";
import { Repository } from "typeorm";
import { BusinessEvent } from "../entities/business-event.entity";
import { TwitterService } from "src/twitter/twitter.service";

export class BusinessEventValidator {

    static dayCoincidenceValidation(start: moment.Moment,
        end: moment.Moment,
        existingEventStart: moment.Moment,
        existingEventEnd: moment.Moment) {
        return start.day() === existingEventStart.day() ||
            start.day() === existingEventEnd.day() ||
            end.day() === existingEventStart.day() ||
            end.day() === existingEventEnd.day()
    }

    static datePeriodValidation(normalizedStart: moment.Moment,
        normalizedEnd: moment.Moment,
        normalizedExistingEnd: moment.Moment,
        normalizedExistingStart: moment.Moment) {
        return normalizedStart.isBetween(normalizedExistingStart, normalizedExistingEnd) ||
            normalizedEnd.isBetween(normalizedExistingStart, normalizedExistingEnd) ||
            normalizedExistingStart.isBetween(normalizedStart, normalizedEnd) ||
            normalizedExistingEnd.isBetween(normalizedStart, normalizedEnd) ||
            normalizedStart.isSame(normalizedExistingStart) ||
            normalizedStart.isSame(normalizedExistingEnd) ||
            normalizedEnd.isSame(normalizedExistingStart) ||
            normalizedEnd.isSame(normalizedExistingEnd)
    }

    static dateIntervalValidation(data) {
        let { event, normalized, context, coincided } = data
        const { normalizedStart, normalizedEnd, normalizedExistingEnd, normalizedExistingStart } = normalized
        const isInInterval = BusinessEventValidator.datePeriodValidation(normalizedStart, normalizedEnd, normalizedExistingEnd, normalizedExistingStart)
        switch (context) {
            case 'daily': {
                if (isInInterval) {
                    return `there has already planed event for this restaurant for this time: ${event.name}`
                }
                return false
            }
            case '':
            case 'weekly': {
                if (event.frequency === 'daily' && isInInterval) {
                    return `there has already planed event for this restaurant for this time: ${event.name}`
                }
                if (coincided) {
                    if (isInInterval) {
                        return `there has already planed event for this restaurant for this time: ${event.name}`
                    }
                }
                return false
            }
        }
    }

    static normalization(start: moment.Moment,
        end: moment.Moment,
        existingEventStart: moment.Moment,
        existingEventEnd: moment.Moment) {
        const year = 2022
        const date = 1
        const subtractionResults = [(end.dayOfYear() - start.dayOfYear()),
        (existingEventEnd.dayOfYear() - existingEventStart.dayOfYear())]
        const normalizedStart = start.set({
            year,
            month: 0,
            date,
            hour: start.get('hour'),
            minute: start.get('minute')
        })

        const normalizedEnd = end.set({
            year,
            month: 0,
            date: subtractionResults[0] > 0 ? subtractionResults[0] + 1 : 1,
            hour: end.get('hour'),
            minute: end.get('minute')
        })

        const normalizedExistingStart = existingEventStart.set({
            year,
            month: 0,
            date,
            hour: existingEventStart.get('hour'),
            minute: existingEventStart.get('minute')
        })

        const normalizedExistingEnd = existingEventEnd.set({
            year,
            month: 0,
            date: subtractionResults[1] > 0 ? subtractionResults[1] + 1 : 1,
            hour: existingEventEnd.get('hour'),
            minute: existingEventEnd.get('minute')
        })
        return { normalizedStart, normalizedEnd, normalizedExistingStart, normalizedExistingEnd }
    }

    static async dateValidation(createBusinessEventDto: CreateBusinessEventDto,
        businessEventRepository: Repository<BusinessEvent>,
        businessRepository: Repository<Business>,
        ): Promise<string | boolean> {
        let start = moment(createBusinessEventDto.event_start, "DD MM YYYY, hh:mm");
        let end = moment(createBusinessEventDto.event_end, "DD MM YYYY, hh:mm");
        const today = moment().startOf('day')
        const events = await DataBaseHelper.getBusinessEvents(createBusinessEventDto, businessEventRepository, businessRepository)

        let message = 'incorrect business ID'
        if (events === false) {
            return message
        }
        if (!start.isValid()) {
            message = `your event start date is invalid`
            return message
        }
        if(start.isSameOrAfter(end)){
            message = `your event start date is after event end date`
            return message
        }
        if (start.isBefore(today)) {
            message = `event cannot be created before today`
            return message
        }
        if (!end.isValid()) {
            message = `your event end date is after event end date`
            return message
        }
        if (!events) {
            message = `internal server error`
            return message
        }

        try {
            switch (createBusinessEventDto.frequency) {
                case '':
                case 'weekly': {
                    const unFilteredEvents = events.some(event => {
                        start = moment(createBusinessEventDto.event_start, "DD MM YYYY, hh:mm");
                        end = moment(createBusinessEventDto.event_end, "DD MM YYYY, hh:mm");
                        const existingEventStart = moment(event.event_start, 'DD-MM-YYYY hh:mm')
                        const existingEventEnd = moment(event.event_end, 'DD-MM-YYYY hh:mm');
                        const coincided = BusinessEventValidator.dayCoincidenceValidation(start, end, existingEventStart, existingEventEnd)
                        const normalized = BusinessEventValidator.normalization(start, end, existingEventStart, existingEventEnd)
                        const data = { event, normalized, context: createBusinessEventDto.frequency, coincided }

                        const validated = BusinessEventValidator.dateIntervalValidation(data)
                        if (typeof validated === 'string') {
                            message = validated
                            return true
                        }
                        return validated
                    })

                    if (unFilteredEvents) {
                        return message
                    }
                    return true
                }
                case 'daily': {

                    if ((end.diff(start, 'hour')) >= 24) {
                        message = `daily event can't be longer then 1 day `
                        return message
                    }

                    const unFilteredEvents = events.some(event => {
                        start = moment(createBusinessEventDto.event_start, "DD MM YYYY, hh:mm");
                        end = moment(createBusinessEventDto.event_end, "DD MM YYYY, hh:mm");
                        const existingEventStart = moment(event.event_start, 'DD-MM-YYYY hh:mm')
                        const existingEventEnd = moment(event.event_end, 'DD-MM-YYYY hh:mm');
                        const normalized = BusinessEventValidator.normalization(start, end, existingEventStart, existingEventEnd)
                        const data = { event, normalized, context: createBusinessEventDto.frequency }
                        const validated = BusinessEventValidator.dateIntervalValidation(data)
                        if (typeof validated === 'string') {
                            message = validated
                            return true
                        }
                        return validated
                    })

                    if (unFilteredEvents) {
                        return message
                    }
                    return true
                }
            }
        } catch (error) {
            return error
        }
    }
}