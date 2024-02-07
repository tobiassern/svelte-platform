CREATE TABLE IF NOT EXISTS "sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"slug" text,
	CONSTRAINT "sites_slug_unique" UNIQUE("slug")
);
