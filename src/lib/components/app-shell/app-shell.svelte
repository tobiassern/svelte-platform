<script lang="ts">
	import { Container } from '$lib/components/container';
	import Sidebar from './sidebar.svelte';
	import MobileMenu from './mobile-menu.svelte';
</script>

<div class="flex flex-col lg:flex-row">
	<MobileMenu><Sidebar class="pt-6" /></MobileMenu>
	<aside class="fixed left-0 top-0 hidden h-dvh w-64 border-r lg:block">
		<Sidebar class="px-3 pb-3 pt-6" />
	</aside>
	<main class="min-h-dvh flex-1 pt-14 lg:pl-64 lg:pt-0">
		<Container class="h-full py-6">
			<slot />
		</Container>
	</main>
</div>
