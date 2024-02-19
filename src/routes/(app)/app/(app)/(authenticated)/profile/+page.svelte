<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import SessionsList from './(components)/sessions-list.svelte';
	import { Separator } from '$lib/components/ui/separator';

	export let data;
</script>

<PageHeader.Root>
	<PageHeader.Title>Profile</PageHeader.Title>
</PageHeader.Root>
<Separator class="my-6" />
<div class="max-w-2xl">
	<SessionsList sessions={data.sessions} currentSession={data.currentSession}></SessionsList>
</div>
