<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { onDestroy } from 'svelte';
	import type { SubmitFunction } from '../$types';

	let isLoading = false;
	let isSubmitting = false;
	let loadingTimer: ReturnType<typeof setTimeout>;

	const handleDeleteSite: SubmitFunction = async () => {
		isSubmitting = true;
		loadingTimer = setTimeout(() => {
			isLoading = true;
		}, 350);
		return async () => {
			isSubmitting = false;
			clearTimeout(loadingTimer);
			isLoading = false;
		};
	};

	onDestroy(() => {
		clearTimeout(loadingTimer);
	});
</script>

<form method="POST" action="?/delete-site">
	<Card.Root>
		<Card.Header>
			<Card.Title>Delete site</Card.Title>
			<Card.Description
				>If you delete this site, all posts will also be removed. This action is not revokable.</Card.Description
			>
		</Card.Header>
		<Card.Footer class="flex-col items-start">
			<Separator class="mb-6" />
			<Button variant="destructive" type="submit">Delete site</Button></Card.Footer
		>
	</Card.Root>
</form>
