import type { Actions, PageServerLoad } from "./$types.js";
import { isSiteMember } from "$lib/server/auth/access";
import { siteMembers, users, sites } from "$lib/schemas/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { fail } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { activate_invite_link_schema } from "$lib/schemas/form/index.js";

export const load: PageServerLoad = async (event) => {

    let site = await isSiteMember(event);

    if (!site.data.inviteLinkId) {
        // If creating the site directly in the database, the inviteLinkId won't auto generate
        const result = await event.locals.db.update(sites).set({ inviteLinkId: createId() }).where(eq(sites.id, site.id)).returning();
        const { id, ...data } = result[0];
        site.data = data;
    }

    const activate_invite_link_form = await superValidate(site.data, zod(activate_invite_link_schema));
    
    return {
        site: site.data,
        members: await event.locals.db.select({ id: users.id, name: users.name, avatarUrl: users.avatarUrl, email: users.email }).from(siteMembers).where(eq(siteMembers.siteId, site.id)).leftJoin(users, eq(users.id, siteMembers.userId)),
        activate_invite_link_form
    };
}

export const actions: Actions = {
    'activate-invite-link': async (event) => {
        const site = await isSiteMember(event);

        const activate_invite_link_form = await superValidate(event.request, zod(activate_invite_link_schema));
        console.log(activate_invite_link_form);

        if (!activate_invite_link_form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { activate_invite_link_form });
        }

        await event.locals.db.update(sites).set({ inviteLinkActive: activate_invite_link_form.data.inviteLinkActive ? true : false }).where(eq(sites.id, site.id))
        // TODO: Do something with the validated form.data

        // Yep, return { form } here too
        return { activate_invite_link_form };
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