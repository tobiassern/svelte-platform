import type { Reroute } from '@sveltejs/kit';
import { PUBLIC_HOST } from '$env/static/public';

export const reroute: Reroute = ({ url }) => {
	console.log("## REROUTE ## ", url.host)
	if (url.host === PUBLIC_HOST) {
		console.log("## REROUTE : (SITE)")
		return '/site' + url.pathname;
	} else if (`app.${PUBLIC_HOST}` === url.host) {
		console.log("## REROUTE : (APP)")
		return '/app' + url.pathname;
	} else {
		console.log("## REROUTE : (PUBLIC)")
		return '/public' + url.pathname;
	}
};
