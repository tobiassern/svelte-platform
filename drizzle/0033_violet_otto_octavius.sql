ALTER TABLE "sites" ADD COLUMN "custom_domain" text;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_custom_domain_unique" UNIQUE("custom_domain");