import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
    event.cookies.set("root_test_cookie", "test", {
        path: "/",
        sameSite: 'lax',
        domain: '.localhost',
        maxAge: 60 * 10,
    })
    return {}
}