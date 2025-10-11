
import { desc } from "drizzle-orm";
import { pgTable, timestamp, uuid, text, integer, unique, index, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  user_id: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
  lastFetchedAt: timestamp("last_fetched_at")
});

export const feed_follows = pgTable("feeds_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  user_id: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
  feed_id: uuid("feed_id").references(() => feeds.id, {onDelete: 'cascade'}).notNull()
}, (t) => [
  unique().on(t.user_id, t.feed_id)
]);

export const posts =  pgTable("posts", { // i was today days old when i found out the pg is for postgres
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    title: text("title").default("title not found"), //defaults to title not found if not provided to avoid null problems later
    url: text("url").notNull(), // not unique becasue the same url can be used for new posts from a blog like <website>/new alwasy being the newest blog post
    description: text("description").default("No description found"), // can be null if we dont get the info
    publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow(), // timezone shennagins, defaults to now if none provided 
    feed_id: uuid("feed_id").references(() => feeds.id, {onDelete: 'cascade'}).notNull() // cascade go brrr when feed is deleted
      }, (posts) => [
      index("publishedAt_idx").on(posts.feed_id, desc(posts.publishedAt)),
      uniqueIndex("unique_feed_url_idx").on(posts.feed_id, posts.url)
    ]);