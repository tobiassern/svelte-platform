ALTER TABLE "posts" ADD COLUMN "content_json" jsonb;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "content_html" text;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN IF EXISTS "content";