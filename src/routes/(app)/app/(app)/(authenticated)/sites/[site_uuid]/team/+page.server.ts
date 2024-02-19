import type { Actions, PageServerLoad } from "./$types.js";
import { isSiteMember } from "$lib/server/auth/access";
import { siteMembers, users } from "$lib/schemas/db/schema.js";
import { eq } from "drizzle-orm";
import { sites } from "$lib/schemas/db/schema.js";
import { createId } from "@paralleldrive/cuid2";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {

    let site = await isSiteMember(event);

    if (!site.data.inviteLinkId) {
        // If creating the site directly in the database, the inviteLinkId won't auto generate
        const result = await event.locals.db.update(sites).set({ inviteLinkId: createId() }).where(eq(sites.id, site.id)).returning();
        const { id, ...data } = result[0];
        site.data = data;
    }

    return { site: site.data, members: await event.locals.db.select({ id: users.id, name: users.name, avatarUrl: users.avatarUrl, email: users.email }).from(siteMembers).where(eq(siteMembers.siteId, site.id)).leftJoin(users, eq(users.id, siteMembers.userId)) };
}

export const actions: Actions = {
    'activate-invite-link': async (event) => {
        const site = await isSiteMember(event);
    },
    'remove-member': async (event) => {
        const formData = await event.request.formData();
        const userId = await formData.get('user_id')?.toString();
        const site = await isSiteMember(event);

        if (!userId) {
            return fail(400, { message: 'Must provide a user ID' });
        }

        if (userId === event.locals.user?.id) {
            return fail(400, { message: 'You are not allowed to remove yourself' });
        }
        const deletedMember = await event.locals.db.delete(siteMembers).where(eq(siteMembers.userId, userId)).returning();

        if (!deletedMember.length) {
            return fail(400, { message: 'No members with the provided user ID found' });
        }
        return { success: true };

    },
    'reroll-invite-link': async (event) => {
        const site = await isSiteMember(event);
        await event.locals.db.update(sites).set({ inviteLinkId: createId() }).where(eq(sites.id, site.id)).returning();
        return { success: true }
    }
}