<script lang="ts">
	import { ChevronsUpDownIcon, CheckIcon, PlusCircleIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';

	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import { sites } from '$lib/schemas/db/schema';
	import { goto } from '$app/navigation';

	type Site = typeof sites.$inferSelect;

	let className: string | undefined | null = undefined;
	export { className as class };

	let open = false;

	let selectedSite: Site | undefined | null = $page.data.site;

	$: selectedSite = $page.data.site;

	function closeAndRefocusTrigger(triggerId: string) {
		open = false;

		tick().then(() => document.getElementById(triggerId)?.focus());
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			aria-label="Select a site"
			class={cn('w-full justify-between', className)}
		>
			{#if selectedSite}
				<Avatar.Root class="mr-2 h-5 w-5">
					<Avatar.Image
						src="https://avatar.vercel.sh/${selectedSite.slug}.png"
						alt={selectedSite.name}
					/>
					<Avatar.Fallback>SC</Avatar.Fallback>
				</Avatar.Root>
				{selectedSite.name}
			{:else}
				Select site
			{/if}
			<ChevronsUpDownIcon class="ml-auto h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="p-0" align="start">
		<Command.Root>
			<Command.Input placeholder="Search site..." />
			<Command.List>
				<Command.Empty>No site found.</Command.Empty>

				<Command.Group heading="Sites">
					{#if $page.data.sites}
						{#each $page.data.sites as site}
							<Command.Item
								onSelect={() => {
									selectedSite = site;
									if (selectedSite && selectedSite.uuid !== $page.params.site_uuid) {
										goto(`/sites/${selectedSite.uuid}`);
									}
									closeAndRefocusTrigger(ids.trigger);
								}}
								value={site.name}
								class="text-sm"
							>
								<Avatar.Root class="mr-2 h-5 w-5">
									<Avatar.Image src="https://avatar.vercel.sh/${site.uuid}.png" alt={site.name} />
									<Avatar.Fallback>SC</Avatar.Fallback>
								</Avatar.Root>
								{site.name}
								<CheckIcon
									class={cn(
										'ml-auto h-4 w-4',
										selectedSite?.uuid !== site.uuid && 'text-transparent'
									)}
								/>
							</Command.Item>
						{/each}
					{/if}
				</Command.Group>
			</Command.List>
			<Command.Separator />
			<Command.List>
				<Command.Group>
					<Command.Item
						onSelect={() => {
							goto('/create-site');
							closeAndRefocusTrigger(ids.trigger);
						}}
					>
						<PlusCircleIcon class="mr-2 h-5 w-5" />
						Create Site
					</Command.Item>
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
