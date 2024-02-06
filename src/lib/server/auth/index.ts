import { GitHub } from "arctic";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";
import { dev } from "$app/environment";

export * from './lucia';

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);