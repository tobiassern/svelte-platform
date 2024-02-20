<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import TeamList from './(components)/team-list.svelte';
	import InviteLink from './(components)/invite-link.svelte';
	import ActivateInviteLinkForm from './(components)/activate-invite-link-form.svelte';
	import * as PageHeader from '$lib/components/page-header';
	export let data;
</script>

<PageHeader.Root>
	<PageHeader.Title>Team</PageHeader.Title>
</PageHeader.Root>
<div class="mt-6 space-y-6">
	<Card.Root class="mx-auto w-full max-w-lg">
		<Card.Header>
			<Card.Title>Team members</Card.Title>
		</Card.Header>
		<Card.Content>
			<TeamList members={data.members} />
		</Card.Content>
	</Card.Root>
	<Card.Root class="mx-auto w-full max-w-lg">
		<Card.Header>
			<Card.Title>Invite team members</Card.Title>
			<Card.Description>Invite new team members to collaborate with.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="space-y-6">
				<InviteLink />
				<ActivateInviteLinkForm activate_invite_link_form={data.activate_invite_link_form} />
			</div>
		</Card.Content>
	</Card.Root>
</div>
