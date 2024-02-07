import { GitHub } from "arctic";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";
import { dev } from "$app/environment";
import type { RequestEvent } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { lucia } from "./lucia";


const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);


const signOut = async (event: RequestEvent) => {
    if (!event.locals.session) {
        return fail(401);
    }
    await lucia.invalidateSession(event.locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
    });
    return true;
}

export { lucia, github, signOut }