CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"title" text DEFAULT 'title not found',
	"url" text NOT NULL,
	"description" text DEFAULT 'No description found',
	"published_at" timestamp with time zone DEFAULT now(),
	"feed_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "publishedAt_idx" ON "posts" USING btree ("feed_id","published_at" desc);--> statement-breakpoint
CREATE UNIQUE INDEX "unique_feed_url_idx" ON "posts" USING btree ("feed_id","url");