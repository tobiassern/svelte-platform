import type { Actions, PageServerLoad } from "./$types";
import { isAuthenticated } from "$lib/server/auth/access";
import { eq, and } from "drizzle-orm";
import { sessions_table, users_table } from "$lib/schemas/db/schema";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { profile_schema } from "$lib/schemas/form";

export const load: PageServerLoad = async (event) => {

    const user = await isAuthenticated(event);

    const profile_form = await superValidate({ name: user.name, email: user.email }, zod(profile_schema));

    return {
        user,
        currentSession: event.locals.session,
        profile_form,
        sessions: await event.locals.db.query.sessions_table.findMany({
            where: eq(sessions_table.userId, user.id)
        })
    }

}

export const actions: Actions = {
    'update-profile': async (event) => {
        const user = await isAuthenticated(event);

        const profile_form = await superValidate(event.request, zod(profile_schema));

        if (!profile_form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { profile_form });
        }

        await event.locals.db.update(users_table).set(profile_form.data).where(eq(users_table.id, user.id));

        return { profile_form }
    },
    'delete-session': async (event) => {
        const user = await isAuthenticated(event);
        const formData = await event.request.formData();
        const sessionId = await formData.get('session_id')?.toString();

        if (!sessionId) {
            return fail(400, { message: 'No session id provided' });
        }

        if (sessionId === event.locals.session?.id) {
            return fail(400, { message: 'Not possible to delete current session. Use logout functionality instead.' });
        }

        await event.locals.db.delete(sessions_table).where(and(eq(sessions_table.userId, user.id), eq(sessions_table.id, sessionId)));

        return { sucess: true }
    }
}