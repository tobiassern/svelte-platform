<script lang="ts">
	export let data;
</script>

<svelte:head>
    <meta name="robots" content="noindex">
	<title>{data.post.title} | {data.site.name}</title>
</svelte:head>
<article class="prose mx-auto">
	<h1>{data.post.title}</h1>
	{@html data.post.content_html}
</article>
