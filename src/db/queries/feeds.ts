import { db } from "src/db/index";
import { feeds, users } from "src/db/schema";
import { getUser, User } from "./users";
import { asc, eq, sql } from "drizzle-orm";
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

export async function markFeedFetched(feedID: string) {

await db.update(feeds)
  .set({
    lastFetchedAt: sql`now()`,
    updatedAt: sql`now()`,
  })
  .where(eq(feeds.id, feedID));
}

export async function getNextFeedToFetch() {
  const rows = await db
    .select({
      id: feeds.id,
      url: feeds.url,
      lastFetchedAt: feeds.lastFetchedAt,
      createdAt: feeds.createdAt,
    })
    .from(feeds)
    .orderBy(
      sql`${feeds.lastFetchedAt} NULLS FIRST`, // nulls before nerds 
      asc(feeds.createdAt),
      asc(feeds.id),
    )
    .limit(1);

  return rows[0] ?? null;
}