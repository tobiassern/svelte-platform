ALTER TABLE "sites" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid();