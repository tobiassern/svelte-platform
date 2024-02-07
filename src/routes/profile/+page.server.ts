import type { Actions } from "./$types";
import { signOut } from '$lib/server/auth';
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
    'sign-out': async (event) => {

        await signOut(event);

        return redirect(302, "/login");
    }
}