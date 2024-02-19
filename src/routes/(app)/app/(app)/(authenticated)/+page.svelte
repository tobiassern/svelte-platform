<script lang="ts">
	import { Container } from '$lib/components/container';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ExternalLinkIcon } from 'lucide-svelte';
	export let data;
	$: console.log(data.sites);
</script>

<Container class="grid grid-cols-1 gap-6 py-10 md:grid-cols-2 lg:grid-cols-3">
	{#each data.sites as site}
		<Card.Root>
			<Card.Header>
				<Card.Title>{site.name}</Card.Title>
				<Button variant="ghost" size="sm" class="-mx-3 self-start"
					><ExternalLinkIcon class="mr-2 h-4 w-4" />https://www.test.com</Button
				>
			</Card.Header>
			<Card.Content>
				<Button href="/sites/{site.uuid}" class="w-full">Edit</Button>
			</Card.Content>
		</Card.Root>
	{/each}
</Container>
