<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import SessionsList from './(components)/sessions-list.svelte';
	import { Separator } from '$lib/components/ui/separator';

	import ProfileForm from './(components)/profile-form.svelte';

	export let data;
</script>

<PageHeader.Root>
	<PageHeader.Title>Profile</PageHeader.Title>
</PageHeader.Root>
<Separator class="my-6" />

<div class="max-w-2xl space-y-6">
	<ProfileForm sForm={data.profile_form}></ProfileForm>
	<SessionsList sessions={data.sessions} currentSession={data.currentSession}></SessionsList>
</div>
