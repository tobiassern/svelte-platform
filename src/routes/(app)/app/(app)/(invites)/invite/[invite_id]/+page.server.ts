import type { PageServerLoad } from "./$types";
import { eq, and } from "drizzle-orm";
import { sites, siteMembers } from "$lib/schemas/db/schema";
export const load: PageServerLoad = async (event) => {

    const site = await event.locals.db.query.sites.findFirst({
        where: eq(sites.inviteLinkId, event.params.invite_id)
    });

    let isMember: boolean | undefined = undefined;

    if (event.locals.user && site) {
        const isSiteMember = await event.locals.db.query.siteMembers.findFirst({
            where: and(eq(siteMembers.userId, event.locals.user.id), eq(siteMembers.siteId, site.id))
        });
        isMember = isSiteMember ? true : false;
    }

    return {
        isAuthenticated: event.locals.user,
        siteName: site?.name,
        siteSlug: site?.slug,
        inviteLinkId: site?.inviteLinkId,
        inviteLinkActive: site?.inviteLinkActive,
        isMember,
    };
}