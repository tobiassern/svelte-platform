import { z } from 'zod';
import slugify from '@sindresorhus/slugify';

export const profile_schema = z.object({
	name: z.string(),
	email: z.string().email()
});

export const activate_invite_link_schema = z.object({
	invite_link_active: z.boolean().optional()
});

export const create_site_schema = z
	.object({
		name: z.string().min(3),
		subdomain: z
			.string()
			.min(1)
			.transform((val) => slugify(val))
	})
	.transform((data) => {
		if (data.name && !data.subdomain) {
			data.subdomain = slugify(data.name);
		}
		return data;
	});

export const update_site_general_information_schema = z.object({
	name: z.string().min(3),
	description: z.string()
});

const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const update_cover_image_schema = z.object({
	cover_image: z
		.custom<File>((f) => f instanceof File, 'Please upload a file.')
		.refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
			message: '.jpg, .jpeg, .png and .webp files are accepted.'
		})
		.refine((file) => file.size < MAX_FILE_SIZE, 'Max 4 MB upload size.')
		.nullable()
});

export const update_subdomain_schema = z.object({
	// subdomain: z.preprocess((val) => slugify(String(val)), z.string().min(1))
	subdomain: z.string().min(1)
});

export const update_custom_domain_schema = z.object({
	custom_domain: z.string().url()
})

export const update_post_schema = z
	.object({
		title: z.string(),
		description: z.string(),
		content_html: z.string(),
		content_json: z.object({}).passthrough(),
		slug: z
			.string()
			.nullable()
			.transform((val) => (!val ? null : val))
	})
	.transform((data) => {
		if (data.title && !data.slug) {
			data.slug = slugify(data.title);
		}

		return data;
	});

export const publish_post_schema = z.object({
	published: z.boolean()
});

export type ActivateInviteLink = typeof activate_invite_link_schema;
