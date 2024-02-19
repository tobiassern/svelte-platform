import type { PageServerLoad, Actions } from "./$types";
import { isSiteMember } from "$lib/server/auth/access";
import { posts } from "$lib/schemas/db/schema";
import { eq } from "drizzle-orm";
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_post_schema } from "$lib/schemas/form";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {

    const site = await isSiteMember(event);


    const create_post_form = await superValidate(zod(create_post_schema));

    return {
        site: site.data, posts: await event.locals.db.query.posts.findMany({
            where: eq(posts.site_id, site.id)
        }),
        create_post_form
    };
}

export const actions: Actions = {
    'create-post': async (event) => {
        const site = await isSiteMember(event);

        const new_post = await event.locals.db.insert(posts).values({
            site_id: site.id
        }).returning({ id: posts.id });

        redirect(301, `/sites/${event.params.site_uuid}/posts/${new_post[0].id}`)
    }
}