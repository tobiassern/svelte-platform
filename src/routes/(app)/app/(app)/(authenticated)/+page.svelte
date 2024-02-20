<script lang="ts">
	import { Container } from '$lib/components/container';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ExternalLinkIcon, PlusCircleIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	export let data;
</script>

<Container class="grid grid-cols-1 gap-6 py-10 md:grid-cols-2 lg:grid-cols-3">
	{#each data.sites as site}
		<Card.Root>
			<Card.Header>
				<Card.Title>{site.name}</Card.Title>
				<Card.Description class={cn('line-clamp-3', !site.description && 'italic')}
					>{site.description ?? 'No description'}</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<Button variant="ghost" size="sm" class="-mx-3 self-start"
					><ExternalLinkIcon class="mr-2 h-4 w-4" />https://www.test.com</Button
				>
			</Card.Content>
			<Card.Footer>
				<Button href="/sites/{site.id}" class="w-full">Edit</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
	<Card.Root>
		<Card.Header>
			<Card.Title>Your next site</Card.Title>
			<Card.Description>The one with the most sites win.</Card.Description>
		</Card.Header>
		<Card.Footer>
			<Button href="/create-site" class="w-full" variant="outline"
				><PlusCircleIcon class="mr-2 size-4"></PlusCircleIcon>Create site</Button
			>
		</Card.Footer>
	</Card.Root>
</Container>
