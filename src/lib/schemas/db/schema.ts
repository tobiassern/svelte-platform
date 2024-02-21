import {
	pgTable,
	unique,
	text,
	timestamp,
	primaryKey,
	jsonb,
	uuid,
	boolean
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const users_table = pgTable('users', {
	id: text('id').primaryKey().notNull(),
	name: text('name'),
	email: text('email').unique(),
	avatarUrl: text('avatar_url')
});

export const oauth_accounts_table = pgTable(
	'oauth_accounts',
	{
		providerId: text('provider_id').notNull(),
		providerUserId: text('provider_user_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users_table.id, { onDelete: 'cascade' })
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.providerId, table.providerUserId] })
		};
	}
);

export const sessions_table = pgTable('sessions', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users_table.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const systemAdmins = pgTable('system_admins', {
	userId: text('user_id')
		.notNull()
		.references(() => users_table.id, { onDelete: 'cascade' })
		.primaryKey()
});

export const sites_table = pgTable('sites', {
	id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
	created_at: timestamp('created_at', {
		withTimezone: true
	}).defaultNow(),
	name: text('name').notNull(),
	description: text('description'),
	cover_image_url: text('cover_image_url'),
	subdomain: text('subdomain').unique().notNull(),
	custom_domain: text('custom_domain').unique(),
	invite_link_active: boolean('invite_link_active'),
	invite_link_id: text('invite_link_id')
		.unique()
		.$defaultFn(() => createId())
});

export const usersRelations = relations(users_table, ({ many }) => ({
	sites: many(siteMembers)
}));

export const sitesRelations = relations(sites_table, ({ many }) => ({
	members: many(siteMembers),
	posts: many(posts)
}));

export const siteMembers = pgTable(
	'site_members',
	{
		site_id: uuid('site_id')
			.notNull()
			.references(() => sites_table.id, { onDelete: 'cascade' }),
		user_id: text('user_id')
			.notNull()
			.references(() => users_table.id, { onDelete: 'cascade' })
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.site_id, table.user_id] })
		};
	}
);

export const userSiteMembersRelations = relations(siteMembers, ({ one }) => ({
	sites: one(sites_table, {
		fields: [siteMembers.site_id],
		references: [sites_table.id]
	}),
	user: one(users_table, {
		fields: [siteMembers.user_id],
		references: [users_table.id]
	})
}));

export const posts = pgTable(
	'posts',
	{
		id: uuid('uuid').primaryKey().notNull().defaultRandom(),
		created_at: timestamp('created_at', {
			withTimezone: true,
			mode: 'date'
		})
			.notNull()
			.defaultNow(),
		slug: text('slug'),
		published: boolean('published').default(false),
		title: text('title'),
		description: text('description'),
		content_json: jsonb('content_json'),
		content_html: text('content_html'),
		site_id: uuid('site_id').references(() => sites_table.id, { onDelete: 'cascade' })
	},
	(t) => ({
		unq: unique().on(t.site_id, t.slug)
	})
);

export const postsRelations = relations(posts, ({ one }) => ({
	site: one(sites_table, {
		fields: [posts.site_id],
		references: [sites_table.id]
	})
}));
