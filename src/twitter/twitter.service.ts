import { Injectable } from '@nestjs/common';
import { TwitterHelper } from './helpers/twitter.helper';
import * as fsExtra from 'fs-extra';
import { CreateBusinessEventDto } from '../businessEvent/dto/create-business-event.dto';
@Injectable()
export class TwitterService {
    async postTweet(event: CreateBusinessEventDto, image: Express.Multer.File) {
        try {
            const rwClient = TwitterHelper.twitterGetClient();
            const media = await Promise.all([
                rwClient.v1.uploadMedia(image.path),
            ]);
            await rwClient.v1.tweet(
                `${event.name},
                \n${event.description}
                \nfrom: ${event.event_start} till: ${event.event_end} ${event.frequency}
                \n${event.features} `,
                { media_ids: media },
            );
            fsExtra.emptyDir('images');
        } catch (error) {
            return error;
        }
    }
}
