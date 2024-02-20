import type { PageServerLoad, Actions } from "./$types";
import { eq, and } from "drizzle-orm";
import { sites, siteMembers } from "$lib/schemas/db/schema";
import { error, redirect } from "@sveltejs/kit";
import { isAuthenticated } from "$lib/server/auth/access";

export const load: PageServerLoad = async (event) => {

    const site = await event.locals.db.query.sites.findFirst({
        where: eq(sites.inviteLinkId, event.params.invite_id)
    });

    if (!site) error(404, 'Not found')

    let isMember: boolean | undefined = undefined;

    if (event.locals.user && site) {
        const isSiteMember = await event.locals.db.query.siteMembers.findFirst({
            where: and(eq(siteMembers.userId, event.locals.user.id), eq(siteMembers.siteId, site.id))
        });
        isMember = isSiteMember ? true : false;
    }

    return {
        isAuthenticated: event.locals.user,
        siteName: site.name,
        siteSlug: site.slug,
        inviteLinkId: site.inviteLinkId,
        inviteLinkActive: site.inviteLinkActive,
        isMember,
    };
}

export const actions: Actions = {
    'join-team': async (event) => {
        const user = await isAuthenticated(event);

        const site = await event.locals.db.query.sites.findFirst({
            where: eq(sites.inviteLinkId, event.params.invite_id)
        });

        if (!site) error(404, 'Invite link not found');

        if (!site.inviteLinkActive) error(404, 'Invite link is not active');

        const isSiteMember = await event.locals.db.query.siteMembers.findFirst({
            where: and(eq(siteMembers.userId, user.id), eq(siteMembers.siteId, site.id))
        });

        if (isSiteMember) error(400, 'Already member');

        await event.locals.db.insert(siteMembers).values({ siteId: site.id, userId: user.id });

        redirect(302, `/sites/${site.uuid}`)
    }
}