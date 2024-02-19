import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { sites, siteMembers } from "$lib/schemas/db/schema";
import { isAuthenticated } from "$lib/server/auth/access";

export const load: PageServerLoad = async (event) => {

    const user = await isAuthenticated(event);

}