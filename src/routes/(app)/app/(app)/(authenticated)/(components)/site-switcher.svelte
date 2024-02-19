<script lang="ts">
	import { ChevronsUpDownIcon, CheckIcon, PlusCircleIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import { sites } from '$lib/schemas/db/schema';
	import { goto } from '$app/navigation';

	type Site = typeof sites.$inferSelect;

	let className: string | undefined | null = undefined;
	export { className as class };

	let open = false;
	let showSiteDialog = false;

	let selectedSite: Site | undefined | null = $page.data.site;

	$: selectedSite = $page.data.site;

	function closeAndRefocusTrigger(triggerId: string) {
		open = false;

		tick().then(() => document.getElementById(triggerId)?.focus());
	}
</script>

<Dialog.Root bind:open={showSiteDialog}>
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
								open = false;
								showSiteDialog = true;
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
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create site</Dialog.Title>
			<Dialog.Description>Add a new site to publish your ideas to the world.</Dialog.Description>
		</Dialog.Header>
		<div>
			<div class="space-y-4 py-2 pb-4">
				<div class="space-y-2">
					<Label for="name">Site name</Label>
					<Input id="name" placeholder="Acme Inc." />
				</div>
				<div class="space-y-2">
					<Label for="plan">Subscription plan</Label>
					<Select.Root>
						<Select.Trigger>
							<Select.Value placeholder="Select a plan" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="free">
								<span class="font-medium">Free </span>-<span class="text-muted-foreground">
									Trial for two weeks
								</span>
							</Select.Item>
							<Select.Item value="pro">
								<span class="font-medium">Pro</span> -
								<span class="text-muted-foreground"> $9/month per user </span>
							</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => (showSiteDialog = false)}>Cancel</Button>
			<Button type="submit">Continue</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
