import type { RequestEvent, ServerLoadEvent } from "@sveltejs/kit";
import { redirect, error } from "@sveltejs/kit";
import { sites_table, siteMembers } from "$lib/schemas/db/schema";
import { eq, and } from "drizzle-orm";

export const isAuthenticated = (event: ServerLoadEvent | RequestEvent) => {
    if (!event.locals.user) redirect(302, `/login?redirect_to=${event.url.pathname}`);


    return event.locals.user;
}

export const isSiteMember = async (event: ServerLoadEvent | RequestEvent) => {

    if (!event.locals.user) redirect(302, `/login?redirect_to=${event.url.pathname}`);

    if (!event.params.site_id) error(400, 'Need to provide site UUID');

    const result = await event.locals.db.query.sites_table.findFirst({
        where: eq(sites_table.id, event.params.site_id),
        with: {
            members: {
                where: eq(siteMembers.user_id, event.locals.user.id)
            }
        }
    });

    if (!result) error(404, 'Not found');
    if (!result.members.find(member => member.user_id === event.locals.user?.id)) error(403, 'Forbidden');

    return result;
}

export const isSystemAdmin = async (event: ServerLoadEvent) => {
    if (!event.locals.user) redirect(302, `/login?redirect_to=${event.url.pathname}`);

    const system_admins = await event.locals.db.query.systemAdmins.findMany();
    if (!system_admins.find(sa => sa.userId === event.locals.user?.id)) {
        error(403, 'Forbidden');
    }
    return true;
}