ALTER TABLE "sites" RENAME COLUMN "slug" TO "subdomain";--> statement-breakpoint
ALTER TABLE "sites" DROP CONSTRAINT "sites_slug_unique";--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_subdomain_unique" UNIQUE("subdomain");