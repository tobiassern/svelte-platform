import type { PageServerLoad } from "./$types"
import { PUBLIC_HOST } from "$env/static/public"
export const load: PageServerLoad = async (event) => {
    event.cookies.set("root_test_cookie", "test", {
        path: "/",
        sameSite: 'lax',
        maxAge: 60 * 10,
    })
    return {}
}