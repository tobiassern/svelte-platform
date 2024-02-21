<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon, Loader2Icon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from './$types.js';
	import { onDestroy } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';

	export let data;

	let isLoading = false;
	let isSubmitting = false;
	let loadingTimer: ReturnType<typeof setTimeout>;
	const handleCreatePost: SubmitFunction = async () => {
		isSubmitting = true;

		loadingTimer = setTimeout(() => {
			isLoading = true;
		}, 250);

		return async ({ update }) => {
			await update();
			clearTimeout(loadingTimer);
			isLoading = false;
			isSubmitting = false;
		};
	};

	onDestroy(() => {
		clearTimeout(loadingTimer);
	});
</script>

<div class="flex items-start justify-between gap-3">
	<PageHeader.Root>
		<PageHeader.Title>Posts</PageHeader.Title>
	</PageHeader.Root>
	<form action="?/create-post" method="POST" use:enhance={handleCreatePost}>
		<Button type="submit" disabled={isSubmitting}
			><svelte:component
				this={isLoading ? Loader2Icon : PlusIcon}
				class={cn('mr-2 size-4', isLoading && 'animate-spin')}
			></svelte:component>Create</Button
		>
	</form>
</div>
<Separator class="my-6"></Separator>
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each data.posts as post}
		<Card.Root class="overflow-hidden">
			<div class="relative aspect-video bg-muted object-cover object-center">
				{#if !post.published}
					<Badge class="absolute right-3 top-3">Unpublished</Badge>
				{/if}
				<img
					src={post.cover_image_url
						? post.cover_image_url
						: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/No_image_available_500_x_500.svg'}
					alt="Post main"
					class="h-full w-full object-cover object-center"
				/>
			</div>
			<Card.Header>
				<Card.Title class={!post.title ? 'italic text-muted-foreground' : ''}
					>{post.title ?? 'No title'}</Card.Title
				>
				<Card.Description
					class={cn('line-clamp-3', !post.description && 'italic text-muted-foreground')}
					>{post.description ?? 'No description'}</Card.Description
				>
			</Card.Header>
			<Card.Footer>
				<Button href="/sites/{data.site.id}/posts/{post.id}">Edit</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
