import type { Actions, PageServerLoad } from "./$types";

import { db } from "$lib/server/db";
import { sessionsTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {

    const result = await db.query.sessionsTable.findMany();

    return {
        sessions: result
    }
}

export const actions: Actions = {
    'delete-session': async ({ request }) => {
        const data = await request.formData();
        const session_id = data.get('session_id')?.toString();
        if (!session_id) return fail(400, { message: 'No session id provided' });
        console.log(session_id);
        await db.delete(sessionsTable).where(eq(sessionsTable.id, session_id));

        return { success: true }
    }
}