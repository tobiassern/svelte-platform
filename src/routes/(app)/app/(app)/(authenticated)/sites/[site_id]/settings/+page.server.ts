import type { PageServerLoad, Actions } from "./$types";
import { isSiteMember } from "$lib/server/auth/access";
import { sites_table } from "$lib/schemas/db/schema";
import { eq } from "drizzle-orm";
import { redirect, fail } from "@sveltejs/kit";
import { update_site_general_information_schema } from "$lib/schemas/form";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async (event) => {

    const site = await isSiteMember(event);

    const general_information_form = await superValidate(site, zod(update_site_general_information_schema));

    return { site, general_information_form };
}

export const actions: Actions = {
    'update-general-information': async (event) => {
        const site = await isSiteMember(event);

        const general_information_form = await superValidate(event.request, zod(update_site_general_information_schema));

        if (!general_information_form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { general_information_form });
        }

        await event.locals.db.update(sites_table).set(general_information_form.data).where(eq(sites_table.id, site.id));

        return { general_information_form }

    },
    'delete-site': async (event) => {
        const site = await isSiteMember(event);

        await event.locals.db.delete(sites_table).where(eq(sites_table.id, site.id));

        redirect(302, '/');
    }
}