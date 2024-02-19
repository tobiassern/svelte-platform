import dotenv from 'dotenv';
// dotenv.config({ path: '.env.development.local' });
dotenv.config();

import type { Config } from "drizzle-kit";
export default {
    schema: "./src/lib/schemas/db/schema.ts",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.POSTGRESS_DRIZZLE_URL ?? ""
    }
} satisfies Config;