import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { feed_follows, feeds, posts } from "../schema";
import { User } from "./users";
import { RSSItem } from "src/rss";

type PostInput = {
  title?: string;
  url: string;
  description?: string | undefined;
  publishedAt?: Date | string | undefined;
  feed_id: string;
};


export async function createPost(post: RSSItem, feedId: string){
    await db.insert(posts).values({
        title: post.title,
        url: post.link,
        description: descriptionCheck(post.description),
        publishedAt: parseRssDate(post.pubDate),
        feed_id: feedId
        })
        .onConflictDoNothing({target: [posts.feed_id, posts.url], 
})};

 
  function parseRssDate(input?: Date | string | undefined): Date | undefined {
    if (!input) {
        return undefined;
    }
    if (typeof input === "string") { // takes the string and makes it a date if it can
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? undefined : d; //takes the date, makes it a number in ms, if that number isnt a number then it defaults to undefined
    }
    return input;
}

function descriptionCheck(desc?: string): string | undefined {
    if (typeof desc === "string") {
        return desc;
    }
    return undefined;
};

export async function getPostsForUser(user: User, postCount: number) { // handler will make post count default to 2 so no need to do checks
    const results = await db.select({
        feedTitle: feeds.name,
        title: posts.title,
        url: posts.url,
        description: posts.description,
        pubDate: posts.publishedAt,
        createdAt: posts.createdAt
    })
    .from(posts)
    .leftJoin(feed_follows, eq(posts.feed_id, feed_follows.feed_id))
    .leftJoin(feeds, eq(posts.feed_id, feeds.id))
    .where(eq(feed_follows.user_id, user.id))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
    .limit(postCount);
    return results;
};
