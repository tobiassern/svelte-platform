import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { sites_table, siteMembers } from "$lib/schemas/db/schema";
import { isAuthenticated } from "$lib/server/auth/access";
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_site_schema } from "$lib/schemas/form";

export const load: PageServerLoad = async (event) => {

    const user = await isAuthenticated(event);

    const form = await superValidate(zod(create_site_schema));

    return { form }
}

export const actions: Actions = {
    'create-site': async (event) => {
        const user = await isAuthenticated(event);
        const form = await superValidate(event.request, zod(create_site_schema));

        if (!form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { form });
        }


        const site = await event.locals.db.transaction(async (tx) => {
            const [site] = await tx.insert(sites_table).values(form.data).returning();
            await tx.insert(siteMembers).values({ site_id: site.id, user_id: user.id });

            return site;
        });

        redirect(302, `/sites/${site.id}`);

    }
}