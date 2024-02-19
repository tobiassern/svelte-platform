<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import SessionsList from './(components)/sessions-list.svelte';

	export let data;

</script>

<PageHeader.Root>
	<PageHeader.Title>Profile</PageHeader.Title>
</PageHeader.Root>
<SessionsList sessions={data.sessions} currentSession={data.currentSession}></SessionsList>
