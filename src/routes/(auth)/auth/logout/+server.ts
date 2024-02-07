import type { RequestHandler } from "./$types";
import { signOut } from '$lib/server/auth';
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
    await signOut(event);
    return redirect(302, "/login");
}