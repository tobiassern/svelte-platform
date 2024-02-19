<script lang="ts">
	import { page } from '$app/stores';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { ChevronsUpDownIcon } from 'lucide-svelte';
	import { getInitials } from '$lib/utils';

</script>

{#if $page.data.user}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="ghost" builders={[builder]} class="justify-between">
				<div class="flex items-center">
					<Avatar.Root class="mr-2 size-6">
						<Avatar.Image src={$page.data.user.avatar_url} alt={$page.data.user.name} />
						<Avatar.Fallback>{getInitials($page.data.user.name)}</Avatar.Fallback>
					</Avatar.Root>
					{$page.data.user.name}
				</div>
				<ChevronsUpDownIcon class="ml-2 h-4 w-4" />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56" align="start" sameWidth={true}>
			<DropdownMenu.Label class="font-normal">
				<div class="flex flex-col space-y-1">
					<p class="text-sm font-medium leading-none">{$page.data.user.name}</p>
					<p class="text-xs leading-none text-muted-foreground">{$page.data.user.email ?? ''}</p>
				</div>
			</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Item href="/profile">Profile</DropdownMenu.Item>

				<DropdownMenu.Item>New Site</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item href="/logout">Log out</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
