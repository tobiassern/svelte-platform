import type { Actions } from "@sveltejs/kit";
import { generateState } from "arctic";
import { github } from "$lib/server/auth";
import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import { PUBLIC_HOST } from "$env/static/public";

export const actions: Actions = {
    'signin_oauth': async (event) => {
        const { cookies } = event;
        const state = generateState();

        const url = await github.createAuthorizationURL(state, {
            scopes: ["email"],
        });

        cookies.set("github_oauth_state", state, {
            path: "/",
            secure: !dev,
            maxAge: 60 * 10,
            sameSite: "lax",
            domain: dev ? '.platform.localhost' : PUBLIC_HOST,
        });

        url.searchParams.set('redirect_to', event.url.searchParams.get('redirect_to') ?? '/')

        redirect(302, url.toString());
    }
}