import { BusinessEvent } from "../entities/business-event.entity";

export type FrequencyType = 'daily'| 'weekly' | ''
export const fileFilter = 'raw|png|jpg|jpeg|tiff|psd|bmp|gif'
export type DateIntervalData = {
    event: BusinessEvent;
    normalized: {
        normalizedStart: moment.Moment;
        normalizedEnd: moment.Moment;
        normalizedExistingStart: moment.Moment;
        normalizedExistingEnd: moment.Moment;
    };
    context: FrequencyType;
    coincided?: boolean;
}