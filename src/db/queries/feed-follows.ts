import { eq } from "drizzle-orm";
import { feed_follows, feeds, users } from "../schema";
import { getUserUUID } from "./users";
import { db } from "..";


export async function createFeedFollow(user_id: string, feed_id: string) {
    const newFeed = await db.insert(feed_follows).values({user_id: user_id, feed_id: feed_id}).returning(); // returns an array! stop forgetting this!!!!!
    const result = await db.select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        userId: feed_follows.user_id,
        feedId: feed_follows.feed_id,
        userName: users.name, // from the joins
        feedName: feeds.name // from the joins
        })
    .from(feed_follows)
    .innerJoin(users, eq(users.id, feed_follows.user_id))
    .innerJoin(feeds, eq(feeds.id,feed_follows.feed_id))
    .where(eq(feed_follows.id, newFeed[0].id));

    return result;
}

export async function getFeedFollowsForUser() {
        const userUUID = await getUserUUID()        
        const results = await db.select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        userId: feed_follows.user_id,
        feedId: feed_follows.feed_id,
        userName: users.name, // from the user join
        feedName: feeds.name // from the feeds join
        })
        .from(feed_follows)
        .innerJoin(feeds, eq(feeds.id,feed_follows.feed_id))
        .innerJoin(users, eq(users.id, feed_follows.user_id))
        .where(eq(feed_follows.user_id, userUUID))
        return results;
};