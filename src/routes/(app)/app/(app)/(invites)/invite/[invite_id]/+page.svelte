<script lang="ts">
	import { Container } from '$lib/components/container';
	import { applyAction, enhance } from '$app/forms';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Loader2Icon } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	import type { SubmitFunction } from './$types.js';
	import { toast } from 'svelte-sonner';

	export let data;

	let isLoading = false;
	let isSubmitting = false;
	let loadingTimer: ReturnType<typeof setTimeout>;

	const handleJoinTeam: SubmitFunction = async () => {
		loadingTimer = setTimeout(() => {
			isLoading = true;
		}, 350);
		isSubmitting = true;
		return async ({ result }) => {
			if (result.type === 'error') {
				toast.error(result.error.message);
			} else {
				await applyAction(result);
			}
			clearTimeout(loadingTimer);
			isLoading = false;
			isSubmitting = false;
		};
	};

	onDestroy(() => {
		clearTimeout(loadingTimer);
	});
</script>

<Container class="flex h-dvh items-center justify-center py-6">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Join {data.site_name}</Card.Title>
			<Card.Description>Anyone with this link can join {data.site_name}.</Card.Description>
		</Card.Header>

		<Card.Footer
			class="flex-col items-stretch justify-between gap-3 lg:flex-row-reverse lg:items-center"
		>
			<form class="contents" method="POST" action="?/join-team" use:enhance={handleJoinTeam}>
				<Button type="submit" disabled={isSubmitting}
					>{#if isLoading}<Loader2Icon class="mr-2 size-4 animate-spin"></Loader2Icon>{/if}Join team</Button
				>
			</form>
			<Button variant="outline" href="/">Go back</Button>
		</Card.Footer>
	</Card.Root>
</Container>
