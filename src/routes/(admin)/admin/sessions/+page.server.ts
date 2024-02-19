import type { Actions, PageServerLoad } from "./$types";

import { sessions } from "$lib/schemas/db/schema";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { isSystemAdmin } from "$lib/server/auth/access";

export const load: PageServerLoad = async (event) => {
    await isSystemAdmin(event);

    const result = await event.locals.db.query.sessions.findMany();

    return {
        sessions: result
    }
}

export const actions: Actions = {
    'delete-session': async ({ request, locals }) => {
        const data = await request.formData();
        const session_id = data.get('session_id')?.toString();
        if (!session_id) return fail(400, { message: 'No session id provided' });
        console.log(session_id);
        await locals.db.delete(sessions).where(eq(sessions.id, session_id));

        return { success: true }
    }
}