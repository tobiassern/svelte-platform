import { z } from 'zod';

export const profile_schema = z.object({
    name: z.string(),
    email: z.string().email()
})