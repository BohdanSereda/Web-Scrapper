import { TwitterApi, TwitterApiReadWrite } from 'twitter-api-v2';

export class TwitterHelper {
    static twitterGetClient(): TwitterApiReadWrite {
        const client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_SECRET_KEY,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_SECRET_TOKEN,
        });
        return client.readWrite;
    }
}
