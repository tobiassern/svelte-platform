import type { Actions, PageServerLoad } from "./$types";

import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth";
export const load: PageServerLoad = async () => {

    const result = await db.query.usersTable.findMany();

    return {
        users: result
    }
}

export const actions: Actions = {
    'delete-user': async ({ request }) => {
        const data = await request.formData();
        const user_id = data.get('user_id')?.toString();
        if (!user_id) return fail(400, { message: 'No user id provided' });

        await lucia.invalidateUserSessions(user_id);
        // console.log(session_id);
        await db.delete(usersTable).where(eq(usersTable.id, user_id));

        return { success: true }
    }
}