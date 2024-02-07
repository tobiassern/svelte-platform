<script lang="ts">
	import TabNav from './(components)/tab-nav.svelte';
	import { page } from '$app/stores';

	const tabNavItems = [
		{
			title: 'Sites',
			href: '/'
		},
		{
			title: 'Users',
			href: '/users'
		},
		{
			title: 'Sessions',
			href: '/sessions'
		}
	];
</script>

<svelte:head>
	<title>Admin | {tabNavItems.find((item) => item.href === $page.url.pathname).title}</title>
</svelte:head>
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
	<h2 class="text-3xl font-bold tracking-tight">Admin</h2>
	<TabNav items={tabNavItems}></TabNav>
	<div>
		<slot />
	</div>
</div>
