<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { ActivateInviteLink } from '$lib/schemas/form';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { toast } from 'svelte-sonner';
	export let activate_invite_link_form: SuperValidated<Infer<ActivateInviteLink>>;
	let activateInviteLinkFormEl: HTMLFormElement;

	const { form, errors, enhance, submitting, delayed } = superForm(activate_invite_link_form, {
		resetForm: false,
		onChange: () => {
			activateInviteLinkFormEl.requestSubmit();
		},
		onUpdated: ({ form }) => {
			console.log(form);
			if (form.valid) {
				toast.success(`Invite link ${form.data.invite_link_active ? 'activated' : 'inactivated'}`);
			}
		}
	});

	$: console.log($form.invite_link_active);
</script>

<form
	bind:this={activateInviteLinkFormEl}
	use:enhance
	class="flex items-center justify-between space-x-2"
	method="POST"
	action="?/activate-invite-link"
>
	<Label for="invite_link_active" class="flex flex-col space-y-1">
		<span>Active</span>
		<span class="text-xs font-normal leading-snug text-muted-foreground">
			When the invite link is activated, anyone with the link can join your site.
		</span>
	</Label>
	<Switch
		includeInput={true}
		id="invite_link_active"
		name="invite_link_active"
		aria-label="Invite Link Active"
		value="active"
		bind:checked={$form.invite_link_active}
		disabled={$submitting}
	/>
</form>
