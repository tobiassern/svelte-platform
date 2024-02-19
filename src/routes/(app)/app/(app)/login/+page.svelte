<script lang="ts">
	import { Container } from '$lib/components/container';
	import { Title } from '$lib/components/title';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { GithubIcon, Loader2Icon } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from './$types';
	import { onDestroy } from 'svelte';

	let isLoading = false;
	let isSubmitting = false;
	let loadingTimer: ReturnType<typeof setTimeout>;

	const handleSignIn: SubmitFunction = async () => {
		isSubmitting = true;
		loadingTimer = setTimeout(() => {
			isLoading = true;
		}, 250);
		return async ({ update, result }) => {
			await update();
			if (result.type !== 'redirect') {
				isSubmitting = false;
				isLoading = false;
				clearTimeout(loadingTimer);
			}
		};
	};

	onDestroy(() => {
		clearTimeout(loadingTimer);
	});
</script>

<Container class="flex h-dvh items-center py-10">
	<Card.Root class="mx-auto w-full max-w-md">
		<Card.Header>
			<Title size="h2" element="h1" class="text-center">Svelte Platform</Title>
			<Card.Description class="text-center"
				>Build multi-tenant applications with custom domains.</Card.Description
			>
		</Card.Header>
		<Card.Content class="text-center">
			<form action="?/signin_oauth" method="POST" use:enhance={handleSignIn}>
				<Button type="submit" disabled={isSubmitting}
					><GithubIcon class="mr-2 size-4"></GithubIcon>Continue with GitHub{#if isLoading}<Loader2Icon
							class="ml-2 size-4 animate-spin"
						/>{/if}</Button
				>
			</form>
		</Card.Content>
	</Card.Root>
</Container>
