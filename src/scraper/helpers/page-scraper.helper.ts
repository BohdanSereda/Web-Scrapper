import axios from 'axios';

export class PageScraperHelper {
    scrapePage = async (url: string): Promise<string> => {
        try {
            let { data } = await axios.get(url);
            return data;
        } catch (error) {
            console.error(error.message);
        }
    };
}
