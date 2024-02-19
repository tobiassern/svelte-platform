import type { Actions } from "@sveltejs/kit";
import { generateState } from "arctic";
import { github } from "$lib/server/auth";
import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
    'signin_oauth': async (event) => {
        const { cookies } = event;
        const state = generateState();

        const url = await github.createAuthorizationURL(state, {
            scopes: ["email"]
        });

        cookies.set("github_oauth_state", state, {
            path: "/",
            secure: !dev,
            maxAge: 60 * 10,
            sameSite: "lax",
            domain: '.platform.localhost',
        });

        redirect(302, url.toString());
    }
}