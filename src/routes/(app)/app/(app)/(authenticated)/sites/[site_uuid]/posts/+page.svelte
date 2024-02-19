<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	export let data;
</script>

<div class="flex items-center justify-between gap-3">
	<PageHeader.Root>
		<PageHeader.Title>Posts</PageHeader.Title>
	</PageHeader.Root>
	<form action="?/create-post" method="POST">
		<Button type="submit"><PlusIcon class="mr-2 size-4"></PlusIcon>Create</Button>
	</form>
</div>
<Separator class="my-6"></Separator>
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each data.posts as post}
		<Card.Root class="overflow-hidden">
			<div>
				<AspectRatio ratio={16 / 9} class="bg-muted">
					<img
						src="https://images.unsplash.com/photo-1708021167528-c9eb4c143bb1?q=80&w=3633&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Post main"
						class="object-cover"
					/>
				</AspectRatio>
			</div>
			<Card.Header>
				<Card.Title class={!post.title ? 'italic text-muted-foreground' : ''}
					>{post.title ?? 'No title'}</Card.Title
				>
				<Card.Description
					class={cn('line-clamp-3', !post.content && 'italic text-muted-foreground')}
					>{post.content ?? 'No content'}</Card.Description
				>
			</Card.Header>
			<Card.Footer>
				<Button href="/sites/{data.site.uuid}/posts/{post.id}">Edit</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
