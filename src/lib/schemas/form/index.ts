import { z } from 'zod';
import { posts } from '../db/schema';
import slugify from '@sindresorhus/slugify';

export const profile_schema = z.object({
    name: z.string(),
    email: z.string().email()
});

export const activate_invite_link_schema = z.object({
    inviteLinkActive: z.boolean().optional()
});

export const update_post_schema = z.object({
    title: z.string(),
    content: z.string(),
    slug: z.string().nullable().transform((val) => !val ? null : val),
    published: z.boolean()
}).transform((data) => {
    if (data.title && !data.slug) {
        data.slug = slugify(data.title);
    }

    return data;
})

export type ActivateInviteLink = typeof activate_invite_link_schema;