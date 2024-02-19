CREATE TABLE IF NOT EXISTS "posts" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"slug" text,
	"title" text,
	"content" text,
	"site_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
