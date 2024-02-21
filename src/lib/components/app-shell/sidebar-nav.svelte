<script lang="ts">
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { dev } from '$app/environment';
	import {
		SailboatIcon,
		ExternalLinkIcon,
		GithubIcon,
		LayoutIcon,
		TriangleIcon
	} from 'lucide-svelte';
	import { PUBLIC_HOST } from '$env/static/public';
	import { vercel_deploy_button_url, github_repo_url } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export let items: { path: string; title: string; icon: typeof SailboatIcon }[];
	export { className as class };

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut
	});

	const promotional_links = [
		{
			label: 'Star on GitHub',
			href: github_repo_url,
			icon: GithubIcon
		},
		{
			label: 'View demo site',
			href: dev ? 'http://demo.platform.localhost:3001' : 'https://demo.platform.sernhe.dev',
			icon: LayoutIcon
		},
		{
			label: 'Deploy your own',
			icon: TriangleIcon,
			href: vercel_deploy_button_url
		}
	];
</script>

{#if $page.data.site && $page.params.site_id}
	<nav class={cn('flex h-full flex-col justify-between', className)}>
		<ul class="flex flex-col space-y-1">
			{#each items as item}
				{@const href = `/sites/${$page.params.site_id}${item.path}`}
				{@const isActive = $page.url.pathname === href}
				<li>
					<Button
						{href}
						variant="ghost"
						class={cn(
							!isActive && 'hover:underline',
							'relative w-full justify-start hover:bg-transparent'
						)}
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
				</li>
			{/each}
			<li>
				<Button
					href="{$page.url.protocol}//{$page.data.site.subdomain}.{PUBLIC_HOST}"
					variant="ghost"
					class={cn('relative w-full justify-start hover:bg-transparent hover:underline')}
					data-sveltekit-noscroll
				>
					<div class="relative flex items-center">
						<ExternalLinkIcon class="mr-2 size-4" />
						Public site
					</div>
				</Button>
			</li>
		</ul>
		<ul>
			{#each promotional_links as promotional_link}
				<li>
					<Button
						href={promotional_link.href}
						variant="ghost"
						class={cn('relative w-full justify-start hover:bg-transparent hover:underline')}
						data-sveltekit-noscroll
					>
						<div class="relative flex w-full items-center">
							<svelte:component this={promotional_link.icon} class="mr-2 size-4" />
							<span class="flex-1">
								{promotional_link.label}
							</span>
							<ExternalLinkIcon class="ml-2 size-4" />
						</div>
					</Button>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
