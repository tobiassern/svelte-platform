<script lang="ts">
	import TabNav from './(components)/tab-nav.svelte';
	import { page } from '$app/stores';
	import { UserNav } from '$lib/components/user-nav';
	import { Title } from '$lib/components/title';

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
	<title>Admin | {tabNavItems.find((item) => item.href === $page.url.pathname)?.title}</title>
</svelte:head>
<div class="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
	<div class="flex items-start justify-between">
		<Title size="h1">Admin</Title>
		<UserNav></UserNav>
	</div>
	<TabNav items={tabNavItems}></TabNav>
	<div>
		<slot />
	</div>
</div>
