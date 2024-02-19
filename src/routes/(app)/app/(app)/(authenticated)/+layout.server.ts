import type { LayoutServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { sites, siteMembers } from "$lib/schemas/db/schema";
import { isAuthenticated } from "$lib/server/auth/access";

export const load: LayoutServerLoad = async (event) => {
    const { locals: { db } } = event;

    const user = await isAuthenticated(event);

    return {
        sites: await db.select({
            name: sites.name,
            slug: sites.slug,
            uuid: sites.uuid,
            members: siteMembers
        }).from(sites).leftJoin(siteMembers, eq(siteMembers.siteId, sites.id)).where(eq(siteMembers.userId, user.id))
    };
}