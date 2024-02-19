import type { Actions, PageServerLoad } from "./$types";
import { sites } from "$lib/schemas/db/schema";
import { fail } from "@sveltejs/kit";
import { isSystemAdmin } from "$lib/server/auth/access";

export const load: PageServerLoad = async (event) => {

    await isSystemAdmin(event);

    const result = await event.locals.db.query.sites.findMany();

    return {
        sites: result
    }
}

export const actions: Actions = {
    'create-site': async ({ request, locals }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString();
        const slug = data.get('slug')?.toString();
        if (!name) {
            throw fail(400, { message: 'Must provide name' });
        }

        if (!slug) {
            throw fail(400, { message: 'Must provide slug' })
        }
        const newSite = await locals.db.insert(sites).values({ name, slug }).returning();
    }
}