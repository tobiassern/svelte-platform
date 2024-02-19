import type { PageServerLoad, Actions } from "./$types";
import { isSiteMember } from "$lib/server/auth/access";
import { posts } from "$lib/schemas/db/schema";
import { eq, and } from "drizzle-orm";
export const load: PageServerLoad = async (event) => {

    const site = await isSiteMember(event);

    return {
        site: site.data,
        post: await event.locals.db.query.posts.findFirst({
            where: and(eq(posts.site_id, site.id), eq(posts.id, event.params.post_id))
        })
    };
}

export const actions: Actions = {
    'update-post': async (event) => {

    }
}