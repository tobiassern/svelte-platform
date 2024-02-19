import { CustomAdapter } from './customAdapter';
import { sessions, users, systemAdmins } from "../../schemas/db/schema";
import { Lucia } from "lucia";
import { dev } from "$app/environment";
import type { DBType } from "$lib/server/db";
import { PUBLIC_HOST } from '$env/static/public';
export function initializeLucia(db: DBType) {
    const adapter = new CustomAdapter(db, sessions, users,
        // systemAdminsTable
    );

    return new Lucia(adapter, {
        getUserAttributes: (attributes) => {
            return {
                name: attributes.name,
                avatar_url: attributes.avatarUrl,
                email: attributes.email
            };
        },
        // getSessionAttributes: (attributes) => {
        //     return {
        //         is_system_admin: attributes.is_system_admin
        //     }
        // },
        sessionCookie: {
            attributes: {
                // set to `true` when using HTTPS
                secure: !dev,
                sameSite: "lax",
                domain: dev ? '.platform.localhost' : PUBLIC_HOST
            }
        }
    });
}

type User = typeof users.$inferSelect;
declare module "lucia" {
    interface Register {
        Lucia: ReturnType<typeof initializeLucia>;
        DatabaseUserAttributes: User;
        // DatabaseSessionAttributes: { is_system_admin: boolean }
    }
}