import { pgTable, timestamp, uuid, text, integer, unique } from "drizzle-orm/pg-core";

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
  user_id: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull() // i dont know why i started but doing foreign keys in snake_case has been a boon for me thinking about it all so im rolling with it. my shitty code, my shitty take :D
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
