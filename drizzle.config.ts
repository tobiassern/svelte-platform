import dotenv from 'dotenv';
dotenv.config();

import type { Config } from 'drizzle-kit';
export default {
	schema: './src/lib/schemas/db/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.POSTGRES_URL_NON_POOLING ?? ''
	}
} satisfies Config;
