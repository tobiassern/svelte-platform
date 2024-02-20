<script lang="ts">
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { SailboatIcon } from 'lucide-svelte';

	let className: string | undefined | null = undefined;
	export let items: { path: string; title: string; icon: typeof SailboatIcon }[];
	export { className as class };

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut
	});
</script>

{#if $page.data.site && $page.params.site_uuid}
	<nav class={cn('flex flex-col space-y-1', className)}>
		{#each items as item}
			{@const href = `/sites/${$page.params.site_uuid}${item.path}`}
			{@const isActive = $page.url.pathname === href}

			<Button
				{href}
				variant="ghost"
				class={cn(!isActive && 'hover:underline', 'relative justify-start hover:bg-transparent')}
				data-sveltekit-noscroll
			>
				{#if isActive}
					<div
						class="absolute inset-0 rounded-md bg-muted"
						in:send={{ key: 'active-sidebar-tab' }}
						out:receive={{ key: 'active-sidebar-tab' }}
					/>
				{/if}

				<div class="relative flex items-center">
					<svelte:component this={item.icon} class="mr-2 size-4" />
					{item.title}
				</div>
			</Button>
		{/each}
	</nav>
{/if}
