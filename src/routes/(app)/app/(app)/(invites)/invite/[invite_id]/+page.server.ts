import type { PageServerLoad, Actions } from "./$types";
import { eq, and } from "drizzle-orm";
import { sites_table, siteMembers } from "$lib/schemas/db/schema";
import { error, redirect } from "@sveltejs/kit";
import { isAuthenticated } from "$lib/server/auth/access";

export const load: PageServerLoad = async (event) => {

    const site = await event.locals.db.query.sites_table.findFirst({
        where: eq(sites_table.invite_link_id, event.params.invite_id)
    });

    if (!site) error(404, 'Not found')

    let isMember: boolean | undefined = undefined;

    if (event.locals.user && site) {
        const isSiteMember = await event.locals.db.query.siteMembers.findFirst({
            where: and(eq(siteMembers.user_id, event.locals.user.id), eq(siteMembers.site_id, site.id))
        });
        isMember = isSiteMember ? true : false;
    }

    return {
        isAuthenticated: event.locals.user,
        site_name: site.name,
        site_subdomain: site.subdomain,
        invite_link_id: site.invite_link_id,
        invite_link_active: site.invite_link_active,
        isMember,
    };
}

export const actions: Actions = {
    'join-team': async (event) => {
        const user = await isAuthenticated(event);

        const site = await event.locals.db.query.sites_table.findFirst({
            where: eq(sites_table.invite_link_id, event.params.invite_id)
        });

        if (!site) error(404, 'Invite link not found');

        if (!site.invite_link_active) error(404, 'Invite link is not active');

        const isSiteMember = await event.locals.db.query.siteMembers.findFirst({
            where: and(eq(siteMembers.user_id, user.id), eq(siteMembers.site_id, site.id))
        });

        if (isSiteMember) error(400, 'Already member');

        await event.locals.db.insert(siteMembers).values({ site_id: site.id, user_id: user.id });

        redirect(302, `/sites/${site.id}`)
    }
}