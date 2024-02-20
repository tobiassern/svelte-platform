<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { MoreVerticalIcon } from 'lucide-svelte';
	import { users_table } from '$lib/schemas/db/schema';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { SubmitFunction } from '../$types';
	import { onDestroy } from 'svelte';
	import { Loader2Icon } from 'lucide-svelte';
	type Member = typeof users_table.$inferSelect;

	export let members: Member[];

	const getInitials = (text: string | null) => {
		if (!text) return '';
		return text
			.split(' ')
			.map((txt) => txt[0]?.toUpperCase() ?? '')
			.join('');
	};

	let removeMemberForm: HTMLFormElement;

	let isSubmitting = false;
	let isLoading = false;
	let loadingTimer: ReturnType<typeof setTimeout>;
	const handleRemoveMember: SubmitFunction = async () => {
		isSubmitting = true;
		loadingTimer = setTimeout(() => {
			isLoading = true;
		}, 250);
		return async ({ result, update }) => {
			if (result.type === 'failure') {
				toast.error(result.data?.message ?? 'An unknown error occured');
			} else if (result.type === 'success') {
				update();
				toast.success('Team member removed');
			}
			clearTimeout(loadingTimer);
			isSubmitting = false;
			isLoading = false;
		};
	};

	onDestroy(() => {
		clearTimeout(loadingTimer);
	});
</script>

<div class="grid gap-6">
	{#each members as member}
		<div class="flex items-center justify-between space-x-4">
			<div class="flex items-center space-x-4">
				<Avatar.Root>
					<Avatar.Image src={member.avatarUrl} alt={member.name} />
					<Avatar.Fallback>{getInitials(member.name)}</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<p class="text-sm font-medium leading-none">{member.name}</p>
					<p class="text-sm text-muted-foreground">{member.email ?? '-'}</p>
				</div>
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" size="icon"
						><MoreVerticalIcon class="size-4" /></Button
					>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Group>
						<form
							method="POST"
							action="?/remove-member"
							bind:this={removeMemberForm}
							use:enhance={handleRemoveMember}
						>
							<input type="text" name="user_id" value="{member.id}" readonly hidden />
							<DropdownMenu.Item
								disabled={isSubmitting}
								on:click={() => removeMemberForm.requestSubmit()}
								class="justify-between"
								>Remove from team{#if isLoading}<Loader2Icon
										class="ml-2 size-4 animate-spin"
									/>{/if}</DropdownMenu.Item
							>
						</form>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	{/each}
</div>
