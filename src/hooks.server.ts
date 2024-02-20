// // src/hooks.server.ts
// import { initializeLucia } from '$lib/server/auth/lucia';
// import type { Handle } from '@sveltejs/kit';
// import { db } from '$lib/server/db';

// export const handle: Handle = async ({ event, resolve }) => {
// 	event.locals.db = db;
// 	event.locals.lucia = initializeLucia(event.locals.db);

// 	const sessionId = event.cookies.get(event.locals.lucia.sessionCookieName);

// 	if (!sessionId) {
// 		event.locals.user = null;
// 		event.locals.session = null;
// 		return resolve(event);
// 	}

// 	const { session, user } = await event.locals.lucia.validateSession(sessionId);
// 	if (session && session.fresh) {
// 		const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
// 		// sveltekit types deviates from the de-facto standard
// 		// you can use 'as any' too
// 		event.cookies.set(sessionCookie.name, sessionCookie.value, {
// 			path: '.',
// 			...sessionCookie.attributes
// 		});
// 	}
// 	if (!session) {
// 		const sessionCookie = event.locals.lucia.createBlankSessionCookie();
// 		event.cookies.set(sessionCookie.name, sessionCookie.value, {
// 			path: '.',
// 			...sessionCookie.attributes
// 		});
// 	}
// 	event.locals.user = user;
// 	event.locals.session = session;

// 	return resolve(event);
// };
