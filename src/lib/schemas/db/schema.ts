import { pgTable, text, timestamp, primaryKey, serial, integer, uuid, boolean } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable("users", {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    email: text("email").unique(),
    avatarUrl: text('avatar_url')
});

export const oauthAccounts = pgTable("oauth_accounts", {
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' })
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
    }

})

export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull()
});

export const systemAdmins = pgTable('system_admins', {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).primaryKey()
});

export const sites = pgTable("sites", {
    id: serial("id").primaryKey(),
    createdAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow(),
    uuid: uuid('uuid').unique().defaultRandom().notNull(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    inviteLinkActive: boolean('invite_link_active'),
    inviteLinkId: text("invite_link_id").unique().$defaultFn(() => createId()),
});

export const usersRelations = relations(users, ({ many }) => ({
    sites: many(siteMembers),
}));

export const sitesRelations = relations(sites, ({ many }) => ({
    members: many(siteMembers),
}));

export const siteMembers = pgTable('site_members', {
    siteId: integer('site_id').references(() => sites.id, { onDelete: 'cascade' }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' })
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.siteId, table.userId] }),
    }

});

export const userSiteMembersRelations = relations(siteMembers, ({ one }) => ({
    sites: one(sites, {
        fields: [siteMembers.siteId],
        references: [sites.id],
    }),
    user: one(users, {
        fields: [siteMembers.userId],
        references: [users.id],
    }),
}));