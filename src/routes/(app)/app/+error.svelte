<script lang="ts">
	import { PUBLIC_HOST } from '$env/static/public';
	import { page } from '$app/stores';
	import { Container } from '$lib/components/container';
	import { Title } from '$lib/components/title';
	import { Button } from '$lib/components/ui/button';
	import { MoveLeftIcon } from 'lucide-svelte';
	import { ModeWatcher } from 'mode-watcher';
</script>

<svelte:head>
	<title>{$page.status} | Svelte Platform</title>
</svelte:head>
<ModeWatcher />
<Container class="flex h-dvh flex-col items-center justify-center py-6">
	<Title element="p" size="p">{$page.status}</Title>
	<Title>{$page.error?.message}</Title>
	<div class="mt-10">
		<Button href="http://app.{PUBLIC_HOST}"
			><MoveLeftIcon class="mr-2 h-4 w-4" />Go back home</Button
		>
	</div>
</Container>
