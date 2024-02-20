ALTER TABLE "posts" DROP CONSTRAINT "posts_site_id_sites_id_fk";
--> statement-breakpoint
ALTER TABLE "site_members" DROP CONSTRAINT "site_members_site_id_sites_id_fk";
--> statement-breakpoint
ALTER TABLE "sites" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_site_id_sites_uuid_fk" FOREIGN KEY ("site_id") REFERENCES "sites"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "site_members" ADD CONSTRAINT "site_members_site_id_sites_uuid_fk" FOREIGN KEY ("site_id") REFERENCES "sites"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN IF EXISTS "id";