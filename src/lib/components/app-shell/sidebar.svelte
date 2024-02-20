<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import SiteSwitcher from './site-switcher.svelte';
	import UserNav from './user-nav.svelte';
	import SidebarNav from './sidebar-nav.svelte';
    import { LayoutDashboardIcon, NewspaperIcon, Users2Icon, CogIcon } from 'lucide-svelte';
    import { cn } from '$lib/utils';
    let className: HTMLDivElement['className'] | undefined = undefined;
    export {className as class};
</script>

<div class={cn('flex h-full flex-col', className)}>
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
