<script lang="ts">
	import { page } from '$app/stores';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import ChevronsUpDownIcon from 'lucide-svelte/icons/chevrons-up-down';
	import LogOutIcon from 'lucide-svelte/icons/log-out';
	import UserIcon from 'lucide-svelte/icons/user';
	import SunIcon from 'lucide-svelte/icons/sun';
	import MoonStarIcon from 'lucide-svelte/icons/moon-star';
	import MonitorIcon from 'lucide-svelte/icons/monitor';
	import { getInitials } from '$lib/utils';
	import { setMode, resetMode, mode } from 'mode-watcher';
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
				<DropdownMenu.Item href="/profile"
					><UserIcon class="mr-2 size-4" />Profile</DropdownMenu.Item
				>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger
					><svelte:component this={$mode === 'dark' ? MoonStarIcon : SunIcon} class="mr-2 size-4"
					></svelte:component>Theme</DropdownMenu.SubTrigger
				>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item on:click={() => setMode('light')}
						><SunIcon class="mr-2 size-4"></SunIcon>Light</DropdownMenu.Item
					>
					<DropdownMenu.Item on:click={() => setMode('dark')}
						><MoonStarIcon class="mr-2 size-4"></MoonStarIcon>Dark</DropdownMenu.Item
					>
					<DropdownMenu.Item on:click={() => resetMode()}
						><MonitorIcon class="mr-2 size-4"></MonitorIcon>System</DropdownMenu.Item
					>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Separator />
			<DropdownMenu.Item href="/logout"><LogOutIcon class="mr-2 size-4" />Log out</DropdownMenu.Item
			>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
