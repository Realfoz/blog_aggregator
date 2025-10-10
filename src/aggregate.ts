import { feedURLFinder, getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds";
import { fetchFeed } from "./rss";

const UNIT_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
};

export async function scrapeFeeds() {
    
        const feedToCheck = await getNextFeedToFetch();
        if (!feedToCheck) {
            console.log("No feeds to fetch");
            return;
        }
        await markFeedFetched(feedToCheck.id) 
        try {
        await markFeedFetched(feedToCheck.id) 
        const feedData = await fetchFeed(feedToCheck.url);
        const feedItems = feedData.channel.item ?? [];
        if (feedItems.length === 0) {
            console.log(`No items for ${feedData.channel.title}`);
        } else {
        console.log(`Update found for ${feedData.channel.title}`)
        for (const it of feedItems) {
        console.log(`[${feedData.channel.title}] ${it.title} — ${it.link}`);
        console.log(`-----------------------------------------------------`)
        }}

        } catch (error: any){
            console.error(`scrapeFeeds error for ${feedToCheck.url}:`, error?.message ?? error);
        }
    }
    

export function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if(!match) {
        throw new Error(
            `Please state a valid time to wait in ONE of the following formats:
            <number>ms
            <number>s
            <number>m
            <number>h`
        )
    }
    const waitTime = Number(match[1]);
    const unit = match[2];
    
     
    console.log(`Collecting feeds every ${match[0]}`)
    return waitTime * UNIT_MS[unit];
}