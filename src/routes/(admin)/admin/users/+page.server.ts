import type { Actions, PageServerLoad } from "./$types";
import { systemAdmins, users } from "$lib/schemas/db/schema";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";

import { isSystemAdmin } from "$lib/server/auth/access";
export const load: PageServerLoad = async (event) => {
    await isSystemAdmin(event);

    const result = await event.locals.db.select().from(users).leftJoin(systemAdmins, eq(users.id, systemAdmins.userId))

    return {
        users: result
    }
}

export const actions: Actions = {
    'system-admin': async ({ request }) => {
        const data = await request.formData();
    },
    'delete-user': async ({ request, locals }) => {
        const data = await request.formData();
        const user_id = data.get('user_id')?.toString();
        if (!user_id) return fail(400, { message: 'No user id provided' });

        await locals.lucia.invalidateUserSessions(user_id);
        // console.log(session_id);
        await locals.db.delete(users).where(eq(users.id, user_id));

        return { success: true }
    }
}