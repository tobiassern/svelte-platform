ALTER TABLE "sites" RENAME COLUMN "uuid" TO "id";--> statement-breakpoint
ALTER TABLE "sites" DROP CONSTRAINT "sites_uuid_unique";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_site_id_sites_uuid_fk";
--> statement-breakpoint
ALTER TABLE "site_members" DROP CONSTRAINT "site_members_site_id_sites_uuid_fk";
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "site_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "site_members" ALTER COLUMN "site_id" SET DATA TYPE uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "site_members" ADD CONSTRAINT "site_members_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_id_unique" UNIQUE("id");