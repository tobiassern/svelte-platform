<script lang="ts">
	import { page } from '$app/stores';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import DicesIcon from 'lucide-svelte/icons/dices';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	$: invite_link = $page.data.site.invite_link_id
		? `${$page.url.host}/invite/${$page.data.site.invite_link_id}`
		: undefined;
</script>

<div class="flex space-x-2">
	<Input value={invite_link} placeholder="Invite link not generated" readonly />
	<Button
		variant="secondary"
		disabled={!invite_link}
		class="shrink-0"
		on:click={() => {
			if (invite_link) {
				navigator.clipboard.writeText(invite_link);
				toast('Invite link copied to clipboard');
			}
		}}>Copy Link</Button
	>
</div>
<form
	class="flex items-center justify-between space-x-2"
	method="POST"
	action="?/reroll-invite-link"
	use:enhance={() => {
		return async ({ update }) => {
			toast.success('Invite link rerolled');
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
