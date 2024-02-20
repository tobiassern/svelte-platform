import type { LayoutServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { sites_table, siteMembers } from "$lib/schemas/db/schema";
import { isAuthenticated } from "$lib/server/auth/access";

export const load: LayoutServerLoad = async (event) => {

    const user = await isAuthenticated(event);

    return {
        sites: await event.locals.db.select({
            id: sites_table.id,
            name: sites_table.name,
            description: sites_table.description,
            subdomain: sites_table.subdomain,
            custom_domain: sites_table.custom_domain
        }).from(sites_table).leftJoin(siteMembers, eq(siteMembers.site_id, sites_table.id)).where(eq(siteMembers.user_id, user.id))
    };
}