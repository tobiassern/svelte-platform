<script lang="ts">
	import { Container } from '$lib/components/container';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import TeamList from './(components)/team-list.svelte';
	import ShareInviteLink from './(components)/share-invite-link.svelte';

	export let data;
</script>

<div class="flex h-full items-center">
	<Card.Root class="mx-auto w-full max-w-lg">
		<Card.Header>
			<Card.Title>Team members</Card.Title>
			<Card.Description>Invite your team members to collaborate</Card.Description>
		</Card.Header>
		<Card.Content>
			<ShareInviteLink />
			<Separator class="my-4"></Separator>
			<TeamList members={data.members} />
		</Card.Content>
	</Card.Root>
</div>
