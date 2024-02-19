import type { RequestEvent, ServerLoadEvent } from "@sveltejs/kit";
import { redirect, error } from "@sveltejs/kit";
import { sites, siteMembers } from "$lib/schemas/db/schema";
import { eq, and } from "drizzle-orm";

export const isAuthenticated = (event: ServerLoadEvent | RequestEvent) => {
    if (!event.locals.user) {
        redirect(302, '/login');
    }

    return event.locals.user;
}

export const isSiteMember = async (event: ServerLoadEvent | RequestEvent) => {

    if (!event.locals.user) redirect(302, '/login');

    if (!event.params.site_uuid) error(400, 'Need to provide site UUID');

    const result = await event.locals.db.query.sites.findFirst({
        where: eq(sites.uuid, event.params.site_uuid),
        with: {
            members: {
                where: eq(siteMembers.userId, event.locals.user.id)
            }
        }
    });

    if (!result) error(404, 'Not found');
    if (!result.members.find(member => member.userId === event.locals.user?.id)) error(403, 'Forbidden');

    const { id, members, ...data } = result
    return { data, id };
}

export const isSystemAdmin = async (event: ServerLoadEvent) => {
    if (!event.locals.user) {
        redirect(302, 'http://auth.platform.localhost:5173');
    }
    const system_admins = await event.locals.db.query.systemAdmins.findMany();
    if (!system_admins.find(sa => sa.userId === event.locals.user?.id)) {
        error(403, 'Forbidden');
    }
    return true;
}