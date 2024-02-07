import type { Reroute } from '@sveltejs/kit';
import { PUBLIC_HOSTNAME } from '$env/static/public';

export const reroute: Reroute = ({ url }) => {
    if (url.hostname === PUBLIC_HOSTNAME) {
        return '/site' + url.pathname;
    } else if (`app.${PUBLIC_HOSTNAME}` === url.hostname) {
        return '/app' + url.pathname;
    } else if (`admin.${PUBLIC_HOSTNAME}` === url.hostname) {
        return '/admin' + url.pathname;
    } else if (`auth.${PUBLIC_HOSTNAME}` === url.hostname) {
        return '/auth' + url.pathname;
    } else {
        return '/public' + url.pathname;
    }
}