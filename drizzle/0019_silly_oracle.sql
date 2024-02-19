ALTER TABLE "sites" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "invite_link_active" boolean;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "invite_link_id" text;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_invite_link_id_unique" UNIQUE("invite_link_id");