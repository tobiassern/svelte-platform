import type { PageServerLoad } from "./$types"
import { PUBLIC_HOST } from "$env/static/public"
export const load: PageServerLoad = async (event) => {
    event.cookies.set("root_test_cookie_with_port", "test_with_port", {
        path: "/",
        domain: '.platform.localhost',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60,
    })
    return {}
}