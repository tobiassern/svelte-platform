import type { PageServerLoad, Actions } from './$types';
import { isSiteMember } from '$lib/server/auth/access';
import { posts } from '$lib/schemas/db/schema';
import { eq, and } from 'drizzle-orm';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	update_post_schema,
	publish_post_schema,
	update_cover_image_schema
} from '$lib/schemas/form';
import { error, fail, redirect } from '@sveltejs/kit';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { del, put } from '@vercel/blob';

export const load: PageServerLoad = async (event) => {
	const site = await isSiteMember(event);
	const post = await event.locals.db.query.posts.findFirst({
		where: and(eq(posts.site_id, site.id), eq(posts.id, event.params.post_id))
	});

	if (!post) {
		return error(404, 'Not found');
	}

	const form = await superValidate(post, zod(update_post_schema));
	const publish_form = await superValidate(post, zod(publish_post_schema));
	const cover_image_form = await superValidate(zod(update_cover_image_schema));
	console.log(post);
	return {
		site,
		post,
		form,
		publish_form,
		cover_image_form
	};
};

export const actions: Actions = {
	'update-post': async (event) => {
		const site = await isSiteMember(event);

		const form = await superValidate(event.request, zod(update_post_schema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		try {
			const result = await event.locals.db
				.update(posts)
				.set(form.data)
				.where(and(eq(posts.site_id, site.id), eq(posts.id, event.params.post_id)))
				.returning();
		} catch (err: any) {
			error(400, err.detail);
		}

		return { form };
	},
	'update-cover-image': async (event) => {
		const site = await isSiteMember(event);
		const post = await event.locals.db.query.posts.findFirst({
			columns: { id: true, cover_image_url: true },
			where: and(eq(posts.site_id, site.id), eq(posts.id, event.params.post_id))
		});

		if (!post) error(404, 'Not found');

		const cover_image_form = await superValidate(event.request, zod(update_cover_image_schema));

		if (!cover_image_form.valid) {
			return fail(400, withFiles({ cover_image_form }));
		}

		if (post.cover_image_url) {
			await del(post.cover_image_url, { token: BLOB_READ_WRITE_TOKEN });
		}

		if (cover_image_form.data.cover_image) {
			const blob = await put(
				`${event.params.post_id}-cover-image`,
				cover_image_form.data.cover_image,
				{
					access: 'public',
					token: BLOB_READ_WRITE_TOKEN
				}
			);
			console.log(blob);
			await event.locals.db
				.update(posts)
				.set({ cover_image_url: blob.url })
				.where(eq(posts.id, event.params.post_id));
		} else {
			await event.locals.db
				.update(posts)
				.set({ cover_image_url: null })
				.where(eq(posts.id, event.params.post_id));
		}

		return withFiles({ cover_image_form });
	},
	'remove-cover-image': async (event) => {
		const site = await isSiteMember(event);
		const post = await event.locals.db.query.posts.findFirst({
			columns: { id: true, cover_image_url: true },
			where: and(eq(posts.site_id, site.id), eq(posts.id, event.params.post_id))
		});

		if (post && post.cover_image_url) {
			await del(post.cover_image_url, { token: BLOB_READ_WRITE_TOKEN });

			await event.locals.db
				.update(posts)
				.set({ cover_image_url: null })
				.where(eq(posts.id, post.id));
		}
		return { success: true };
	},
	'publish-post': async (event) => {
		const site = await isSiteMember(event);

		const publish_form = await superValidate(event.request, zod(publish_post_schema));

		if (!publish_form.valid) {
			return fail(400, { publish_form });
		}

		await event.locals.db
			.update(posts)
			.set(publish_form.data)
			.where(and(eq(posts.site_id, site.id), eq(posts.id, event.params.post_id)));

		return { publish_form };
	},
	'delete-post': async (event) => {
		const site = await isSiteMember(event);
		const post = await event.locals.db.query.posts.findFirst({
			where: and(eq(posts.site_id, site.id), eq(posts.id, event.params.post_id))
		});

		if (!post) error(404, 'Not found');

		if (post.cover_image_url) {
			await del(post.cover_image_url, { token: BLOB_READ_WRITE_TOKEN });
		}

		await event.locals.db
			.delete(posts)
			.where(and(eq(posts.site_id, site.id), eq(posts.id, event.params.post_id)));

		redirect(302, `/sites/${site.id}/posts`);
	}
};
