import type { PageServerLoad } from "./$types";
import { isAuthenticated } from "$lib/server/auth/access";

export const load: PageServerLoad = async (event) => {

    const user = await isAuthenticated(event);

}