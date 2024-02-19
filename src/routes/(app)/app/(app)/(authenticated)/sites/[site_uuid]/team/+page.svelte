<script lang="ts">
	import { Container } from '$lib/components/container';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import TeamList from './(components)/team-list.svelte';
	import ShareInviteLink from './(components)/share-invite-link.svelte';
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
			<ShareInviteLink />
		</Card.Content>
	</Card.Root>
</div>
