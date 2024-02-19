<script lang="ts">
	import { page } from '$app/stores';
	import { Container } from '$lib/components/container';
	import SidebarNav from './(components)/sidebar-nav.svelte';
	import SiteSwitcher from './(components)/site-switcher.svelte';
	import UserNav from './(components)/user-nav.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { LayoutDashboardIcon, CogIcon, NewspaperIcon, Users2Icon } from 'lucide-svelte';
</script>

<div class="flex">
	<aside class="fixed left-0 top-0 h-dvh w-64 border-r hidden lg:block">
		<div class="flex h-full flex-col px-3 pb-3 pt-6">
			<SiteSwitcher />
			<Separator class="my-3"></Separator>
			<div class="-my-3 flex-1 overflow-y-scroll py-6">
				<SidebarNav
					items={[
						{ path: '', title: 'Dashboard', icon: LayoutDashboardIcon },
						{ path: '/posts', title: 'Posts', icon: NewspaperIcon },
						{ path: '/team', title: 'Team', icon: Users2Icon },
						{ path: '/settings', title: 'Settings', icon: CogIcon }
					]}
				></SidebarNav>
			</div>
			<Separator class="my-3"></Separator>
			<UserNav />
		</div>
	</aside>
	<main class="min-h-dvh flex-1 lg:pl-64">
		<Container class="h-full py-6">
			<slot />
		</Container>
	</main>
</div>
