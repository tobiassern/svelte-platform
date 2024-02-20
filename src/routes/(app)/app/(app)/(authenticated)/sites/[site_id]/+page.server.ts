import type { PageServerLoad } from "./$types";
import { isSiteMember } from "$lib/server/auth/access";

export const load: PageServerLoad = async (event) => {

    const site = await isSiteMember(event);

    return { site: site };
}