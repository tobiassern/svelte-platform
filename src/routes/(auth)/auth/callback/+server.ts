import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { github, lucia } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { oauthAccountsTable, usersTable } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "lucia";
import { OAuth2RequestError } from "arctic";


interface GitHubUser {
    id: string;
    login: string;
}

export const GET: RequestHandler = async (event) => {
    const code = event.url.searchParams.get("code");
    const state = event.url.searchParams.get("state");

    const storedState = event.cookies.get("oauth_state") ?? null;

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

        const existingUser = await db.select().from(oauthAccountsTable).where(and(eq(oauthAccountsTable.providerId, 'github'), eq(oauthAccountsTable.providerUserId, githubUser.id)));
        if (existingUser[0]) {
            const session = await lucia.createSession(existingUser[0].userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
            });
        } else {
            const userId = generateId(15);
            await db.insert(usersTable).values({
                id: userId,
            });
            await db.insert(oauthAccountsTable).values({ providerId: "github", providerUserId: githubUser.id, userId: userId })
            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
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