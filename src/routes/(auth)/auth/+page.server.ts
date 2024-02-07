import type { Actions } from "@sveltejs/kit";
import { generateState } from "arctic";
import { github } from "$lib/server/auth";
import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
    'oauth': async (event) => {
        const state = generateState();

        const url = await github.createAuthorizationURL(state);

        event.cookies.set("oauth_state", state, {
            path: "/",
            secure: !dev,
            httpOnly: true,
            maxAge: 60 * 10,
            sameSite: "lax"
        });

        redirect(302, url.toString());
    }
}