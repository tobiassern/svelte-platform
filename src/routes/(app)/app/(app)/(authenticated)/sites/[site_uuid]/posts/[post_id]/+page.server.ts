import type { PageServerLoad, Actions } from "./$types";
import { isSiteMember } from "$lib/server/auth/access";
import { posts } from "$lib/schemas/db/schema";
import { eq, and } from "drizzle-orm";
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { update_post_schema } from "$lib/schemas/form";
import { error, fail } from "@sveltejs/kit";
import type { } from 'drizzle-orm/vercel-postgres';

export const load: PageServerLoad = async (event) => {

    const site = await isSiteMember(event);
    const post = await event.locals.db.query.posts.findFirst({
        where: and(eq(posts.site_id, site.id), eq(posts.id, event.params.post_id))
    });

    if (!post) {
        return error(404, 'Not found');
    }

    const form = await superValidate(post, zod(update_post_schema));

    return {
        site: site.data,
        post,
        form
    };
}

export const actions: Actions = {
    'update-post': async (event) => {
        const site = await isSiteMember(event);

        const form = await superValidate(event.request, zod(update_post_schema));

        if (!form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { form });
        }

        try {
            const result = await event.locals.db.update(posts).set(form.data).where(and(eq(posts.site_id, site.id), eq(posts.id, event.params.post_id))).returning();
        } catch (err: any) {

            error(400, err.detail)
        }

        return { form };

    }
}