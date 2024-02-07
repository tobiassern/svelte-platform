import type { PageServerLoad } from "./$types"
import { PUBLIC_HOST } from "$env/static/public"
export const load: PageServerLoad = async (event) => {
    event.cookies.set("root_test_cookie", "test", {
        path: ".",
        domain: '.platform.sernhe.dev',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60,
    })
    return {}
}