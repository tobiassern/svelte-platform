import type { PageServerLoad, Actions } from './$types';
import { isSiteMember } from '$lib/server/auth/access';
import { sites_table } from '$lib/schemas/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
import {
	update_site_general_information_schema,
	update_subdomain_schema,
	update_cover_image_schema
} from '$lib/schemas/form';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { put, del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export const load: PageServerLoad = async (event) => {
	const site = await isSiteMember(event);

	const general_information_form = await superValidate(
		site,
		zod(update_site_general_information_schema)
	);

	const subdomain_form = await superValidate(site, zod(update_subdomain_schema));

	const cover_image_form = await superValidate(zod(update_cover_image_schema));

	return { site, general_information_form, subdomain_form, cover_image_form };
};

export const actions: Actions = {
	'update-general-information': async (event) => {
		const site = await isSiteMember(event);

		const general_information_form = await superValidate(
			event.request,
			zod(update_site_general_information_schema)
		);

		if (!general_information_form.valid) {
			return fail(400, { general_information_form });
		}

		await event.locals.db
			.update(sites_table)
			.set(general_information_form.data)
			.where(eq(sites_table.id, site.id));

		return { general_information_form };
	},
	'update-cover-image': async (event) => {
		const site = await isSiteMember(event);

		const cover_image_form = await superValidate(event.request, zod(update_cover_image_schema));

		if (!cover_image_form.valid) {
			return fail(400, withFiles({ cover_image_form }));
		}

		if (site.cover_image_url) {
			await del(site.cover_image_url, { token: BLOB_READ_WRITE_TOKEN });
		}

		if (cover_image_form.data.cover_image) {
			const blob = await put(`${site.id}-banner`, cover_image_form.data.cover_image, {
				access: 'public',
				token: BLOB_READ_WRITE_TOKEN
			});
			await event.locals.db
				.update(sites_table)
				.set({ cover_image_url: blob.url })
				.where(eq(sites_table.id, site.id));
		} else {
			await event.locals.db
				.update(sites_table)
				.set({ cover_image_url: null })
				.where(eq(sites_table.id, site.id));
		}

		return withFiles({ cover_image_form });
	},
	'remove-cover-image': async (event) => {
		const site = await isSiteMember(event);
		if (site.cover_image_url) {
			await del(site.cover_image_url, { token: BLOB_READ_WRITE_TOKEN });
		}
		await event.locals.db
			.update(sites_table)
			.set({ cover_image_url: null })
			.where(eq(sites_table.id, site.id));
		return { success: true };
	},
	'update-subdomain': async (event) => {
		const site = await isSiteMember(event);

		const subdomain_form = await superValidate(event.request, zod(update_subdomain_schema));

		if (!subdomain_form.valid) {
			return fail(400, { subdomain_form });
		}

		await event.locals.db
			.update(sites_table)
			.set(subdomain_form.data)
			.where(eq(sites_table.id, site.id));

		return { subdomain_form };
	},
	'delete-site': async (event) => {
		const site = await isSiteMember(event);

		await event.locals.db.delete(sites_table).where(eq(sites_table.id, site.id));

		redirect(302, '/');
	}
};
