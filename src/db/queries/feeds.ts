import { db } from "src/db/index";
import { feeds, users } from "src/db/schema";
import { getUser, User } from "./users";
import { eq } from "drizzle-orm";
import { readConfig } from "src/config";

export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts

export async function createFeed(user_id: string, feedName: string, feedURL: string) {
    const [result] = await db.insert(feeds).values({user_id: user_id, name: feedName, url:feedURL }).returning();
    return result;
}

export async function getFeedsWithCreator() {
     const result = await db.select().from(feeds).innerJoin(users, eq(feeds.user_id,users.id));
     return result;
}

export async function printFeed(user: User, feed: Feed){ 
    console.log(`Feed added by user: ${user.name}`)
    console.log(`Feed name: ${feed.name}`)
    console.log(`Feed URL: ${feed.url}`)
}


export async function feedURLFinder(url: string) {
    const result = await db.select({ id: feeds.id, name: feeds.name}).from(feeds).where(eq(feeds.url, url))
    return result;
};
