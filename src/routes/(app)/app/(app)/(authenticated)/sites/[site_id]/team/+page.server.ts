import type { Actions, PageServerLoad } from './$types.js';
import { isSiteMember } from '$lib/server/auth/access';
import { siteMembers, users_table, sites_table } from '$lib/schemas/db/schema';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { activate_invite_link_schema } from '$lib/schemas/form/index.js';

export const load: PageServerLoad = async (event) => {
	const site = await isSiteMember(event);

	if (!site.invite_link_id) {
		const [result] = await event.locals.db
			.update(sites_table)
			.set({ invite_link_id: createId() })
			.where(eq(sites_table.id, site.id))
			.returning();
		site.invite_link_id = result.invite_link_id;
	}

	const activate_invite_link_form = await superValidate(site, zod(activate_invite_link_schema));
	return {
		site,
		members: await event.locals.db
			.select({
				id: users_table.id,
				name: users_table.name,
				avatarUrl: users_table.avatarUrl,
				email: users_table.email
			})
			.from(siteMembers)
			.where(eq(siteMembers.site_id, site.id))
			.leftJoin(users_table, eq(users_table.id, siteMembers.user_id)),
		activate_invite_link_form
	};
};

export const actions: Actions = {
	'activate-invite-link': async (event) => {
		const site = await isSiteMember(event);

		const activate_invite_link_form = await superValidate(
			event.request,
			zod(activate_invite_link_schema)
		);

		if (!activate_invite_link_form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { activate_invite_link_form });
		}

		await event.locals.db
			.update(sites_table)
			.set({ invite_link_active: activate_invite_link_form.data.invite_link_active ? true : false })
			.where(eq(sites_table.id, site.id));
		// TODO: Do something with the validated form.data

		// Yep, return { form } here too
		return { activate_invite_link_form };
	},
	'remove-member': async (event) => {
		const formData = await event.request.formData();
		const userId = await formData.get('user_id')?.toString();
		const site = await isSiteMember(event);

		if (!userId) {
			return fail(400, { message: 'Must provide a user ID' });
		}

		if (userId === event.locals.user?.id) {
			return fail(400, { message: 'You are not allowed to remove yourself' });
		}
		const deletedMember = await event.locals.db
			.delete(siteMembers)
			.where(eq(siteMembers.user_id, userId))
			.returning();

		if (!deletedMember.length) {
			return fail(400, { message: 'No members with the provided user ID found' });
		}
		return { success: true };
	},
	'reroll-invite-link': async (event) => {
		const site = await isSiteMember(event);
		await event.locals.db
			.update(sites_table)
			.set({ invite_link_id: createId() })
			.where(eq(sites_table.id, site.id))
			.returning();
		return { success: true };
	}
};
