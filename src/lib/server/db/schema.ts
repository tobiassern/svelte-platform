import { pgTable, text, timestamp, primaryKey, serial } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: text("id").primaryKey()
});

export const oauthAccountsTable = pgTable("oauth_accounts", {
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => usersTable.id)
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
    }

})

export const sessionsTable = pgTable("sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => usersTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull()
});

export const sitesTable = pgTable("sites", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull()
});
