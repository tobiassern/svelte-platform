import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { sitesTable } from "$lib/server/db/schema";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {

    const result = await db.query.sitesTable.findMany();

    return {
        sites: result
    }
}

export const actions: Actions = {
    'create-site': async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString();
        const slug = data.get('slug')?.toString();
        if (!name) {
            throw fail(400, { message: 'Must provide name' });
        }

        if (!slug) {
            throw fail(400, { message: 'Must provide slug' })
        }
        const newSite = await db.insert(sitesTable).values({ name, slug }).returning();
    }
}