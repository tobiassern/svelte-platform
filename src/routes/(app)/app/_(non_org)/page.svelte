<script lang="ts">
	import { Title } from '$lib/components/title';

	export let data;
	let { sites } = data;
	$: ({ sites } = data);
</script>

<svelte:head>
	<title>App | Svelte Platform</title>
</svelte:head>
<Title size="h1" class="text-center">Welcome to Svelte Platform</Title>
<ul>
	{#each sites as site}
		<li><a href="/{site.slug}">{site.name}</a></li>
	{/each}
</ul>
