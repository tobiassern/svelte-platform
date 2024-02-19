import type { Lucia } from 'lucia';
import type { DBType } from '$lib/server/db';
import { sites } from '$lib/schemas/db/schema';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// db: import('drizzle-orm/pg-postgres').VercelPgDatabase<typeof import('$lib/schema/schema') >;
			db: DBType;
			lucia: Lucia;
			user: import("lucia").User | null;
			session: import("lucia").Session | null;
		}
		// interface PageData {
		// 	site: typeof sites.$inferSelect | undefined | null;
		// 	sites: typeof sites.$inferSelect[] | undefined | null;
		// }
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
