import { createPool } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { POSTGRES_URL } from '$env/static/private';
import * as schema from './schema';

export const db = drizzle(createPool({ connectionString: POSTGRES_URL }), { schema });