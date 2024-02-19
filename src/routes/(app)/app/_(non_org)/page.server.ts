import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    const { locals: { session } } = event;

    if (!session) {
        redirect(302, '/login');
    }
}