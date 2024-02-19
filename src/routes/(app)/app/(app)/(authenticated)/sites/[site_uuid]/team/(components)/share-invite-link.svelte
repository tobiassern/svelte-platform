<script lang="ts">
	import { page } from '$app/stores';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { DicesIcon } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	$: inviteLink = $page.data.site.inviteLinkId
		? `${$page.url.host}/invite/${$page.data.site.inviteLinkId}`
		: undefined;
</script>

<div class="space-y-6">
	<div class="flex space-x-2">
		<Input value={inviteLink} placeholder="Invite link not generated" readonly />
		<Button
			variant="secondary"
			disabled={!inviteLink}
			class="shrink-0"
			on:click={() => {
				if (inviteLink) {
					navigator.clipboard.writeText(inviteLink);
					toast('Invite link copied to clipboard');
				}
			}}>Copy Link</Button
		>
	</div>
	<div class="flex items-center justify-between space-x-2">
		<Label for="necessary" class="flex flex-col space-y-1">
			<span>Active</span>
			<span class="text-xs font-normal leading-snug text-muted-foreground">
				When the invite link is activated, anyone with the link can join your site.
			</span>
		</Label>
		<Switch id="necessary" checked aria-label="Necessary" />
	</div>
	<form
		class="flex items-center justify-between space-x-2"
		method="POST"
		action="?/reroll-invite-link"
		use:enhance={() => {
			return async ({ update }) => {
				toast('Invite link rerolled');
				update();
			};
		}}
	>
		<div class="flex flex-col space-y-1">
			<span>Reroll</span>
			<span class="text-xs font-normal leading-snug text-muted-foreground">
				This will create a new invite link, and the old invite link will be invalidated.
			</span>
		</div>
		<Button type="submit" size="icon" variant="outline"><DicesIcon class="size-4" /></Button>
	</form>
</div>
