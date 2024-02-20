import type { Reroute } from '@sveltejs/kit';
import { PUBLIC_HOST } from '$env/static/public';

export const reroute: Reroute = ({ url }) => {
	console.log("## REROUTE ## ", url.host)
	if (url.host === PUBLIC_HOST) {
		return '/site' + url.pathname;
	} else if (`app.${PUBLIC_HOST}` === url.host) {
		return '/app' + url.pathname;
	} else {
		return '/public' + url.pathname;
	}
};
