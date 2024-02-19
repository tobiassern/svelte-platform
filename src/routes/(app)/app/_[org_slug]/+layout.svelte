<script lang="ts">
	import { Container } from '$lib/components/container';
	import TeamSwitcher from './(components)/team-switcher.svelte';
	import DashboardMainNav from './(components)/dashboard-main-nav.svelte';
	import { UserNav } from '$lib/components/user-nav';
</script>

<div class="border-b">
	<Container class="flex h-16 items-center gap-x-3">
		<TeamSwitcher />
		<DashboardMainNav class="mx-6" />
		<div class="ml-auto flex items-center space-x-4">
			<!-- <Search /> -->
			<UserNav />
		</div>
	</Container>
</div>
<Container class="py-6">
	<slot />
</Container>
