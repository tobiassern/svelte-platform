import { z } from 'zod';

export const profile_schema = z.object({
    name: z.string(),
    email: z.string().email()
});

export const activate_invite_link_schema = z.object({
    inviteLinkActive: z.boolean().optional()
});

export const create_post_schema = z.object({
    title: z.string()
})

export type ActivateInviteLink = typeof activate_invite_link_schema;
export type CreatePost = typeof create_post_schema;