import type { Actions, PageServerLoad } from "./$types";
import { isAuthenticated } from "$lib/server/auth/access";
import { eq, and } from "drizzle-orm";
import { sessions } from "$lib/schemas/db/schema";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {

    const user = await isAuthenticated(event);

    return {
        user,
        currentSession: event.locals.session,
        sessions: await event.locals.db.query.sessions.findMany({
            where: eq(sessions.userId, user.id)
        })
    }

}

export const actions: Actions = {
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

        await event.locals.db.delete(sessions).where(and(eq(sessions.userId, user.id), eq(sessions.id, sessionId)));

        return { sucess: true }
    }
}