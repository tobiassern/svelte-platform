import type { RequestHandler } from "./$types";
import { github } from "$lib/server/auth";
import { oauthAccounts, users } from "$lib/schemas/db/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "lucia";
import { OAuth2RequestError } from "arctic";
import { json } from "@sveltejs/kit";


interface GitHubUser {
    id: string;
    login: string;
    name: string | null;
    avatar_url: string | null;
}

export const GET: RequestHandler = async (event) => {
    const code = event.url.searchParams.get("code");
    const state = event.url.searchParams.get("state");

    const storedState = event.cookies.get("github_oauth_state") ?? null;

    // return json({
    //     code, state, storedState
    // })

    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
        const githubUser: GitHubUser = await githubUserResponse.json();
        console.log(githubUser);

        const existingUser = await event.locals.db.select().from(oauthAccounts).where(and(eq(oauthAccounts.providerId, 'github'), eq(oauthAccounts.providerUserId, githubUser.id)));
        if (existingUser[0]) {
            console.log("EXISTING USER");
            const session = await event.locals.lucia.createSession(existingUser[0].userId, {});
            const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                ...sessionCookie.attributes,
                path: "/"
            });
        } else {
            console.log("NEW USER")
            const userId = generateId(15);
            await event.locals.db.insert(users).values({
                id: userId,
                avatarUrl: githubUser.avatar_url,
                name: githubUser.name
            });
            await event.locals.db.insert(oauthAccounts).values({ providerId: "github", providerUserId: githubUser.id, userId: userId })
            const session = await event.locals.lucia.createSession(userId, {});
            const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                ...sessionCookie.attributes,
                path: "/"

            });
        }
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/"
            }
        });
    } catch (e) {
        console.log(e);
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return new Response(null, {
                status: 400
            });
        }
        return new Response(null, {
            status: 500
        });
    }

}