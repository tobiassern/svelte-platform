<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Container } from '$lib/components/container';
	import { afterNavigate } from '$app/navigation';
	import { PanelRightOpenIcon } from 'lucide-svelte';
	let sheetOpen = false;
	afterNavigate(() => {
		sheetOpen = false;
	});
</script>

<Container class="fixed left-0 top-0 z-50 w-full border-b bg-background py-2 lg:hidden">
	<Sheet.Root bind:open={sheetOpen}>
		<Sheet.Overlay></Sheet.Overlay>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]} variant="ghost" size="icon"
				><PanelRightOpenIcon class="size-5" /></Button
			>
		</Sheet.Trigger>
		<Sheet.Content side="left">
			<slot />
		</Sheet.Content>
	</Sheet.Root>
</Container>
