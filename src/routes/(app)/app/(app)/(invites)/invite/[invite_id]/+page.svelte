<script lang="ts">
	import { Container } from '$lib/components/container';
	import * as PageHeader from '$lib/components/page-header';

	export let data;
</script>

<Container class="flex h-dvh items-center justify-center py-6">
	{#if data.siteName && data.inviteLinkId && data.inviteLinkActive && !data.isMember}
		<PageHeader.Root>
			<PageHeader.Title>Join the team for {data.siteName}</PageHeader.Title>
		</PageHeader.Root>
		{#if data.isAuthenticated}
			Is logged in
		{:else}
			Is not logged in
		{/if}
	{:else if data.inviteLinkId && data.inviteLinkActive !== true}
    <PageHeader.Root>
        <PageHeader.Title>This invite link is currently not active</PageHeader.Title>
    </PageHeader.Root>
    {:else}
		<PageHeader.Root>
			<PageHeader.Title>Another case</PageHeader.Title>
		</PageHeader.Root>
	{/if}
</Container>
