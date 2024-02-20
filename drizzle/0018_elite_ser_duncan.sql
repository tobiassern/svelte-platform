CREATE TABLE IF NOT EXISTS "site_members"(
    "site_id" integer,
    "user_id" text NOT NULL,
    CONSTRAINT "site_members_site_id_user_id_pk" PRIMARY KEY ("site_id", "user_id")
);

--> statement-breakpoint
DO $$
BEGIN
    ALTER TABLE "site_members"
        ADD CONSTRAINT "site_members_site_id_sites_id_fk" FOREIGN KEY("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE NO action;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

--> statement-breakpoint
DO $$
BEGIN
    ALTER TABLE "site_members"
        ADD CONSTRAINT "site_members_user_id_users_id_fk" FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO action;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

