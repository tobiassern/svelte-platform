<script lang="ts">
	export let data;
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
	<title>{data.site.name}</title>
</svelte:head>
<div class="bg-white py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		{#if data.site.cover_image_url}
			<img
				src={data.site.cover_image_url}
				alt={data.site.name}
				class="-mt-20 mb-4 aspect-video w-full rounded-2xl sm:-mt-28"
			/>
		{/if}
		<div class="mx-auto max-w-2xl lg:mx-0">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{data.site.name}</h1>
			{#if data.site.description}
				<p class="mt-2 text-lg leading-8 text-gray-600">
					{data.site.description}
				</p>
			{/if}
		</div>
		<div
			class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3"
		>
			{#each data.site.posts as post}
				<article class="flex max-w-xl flex-col items-start justify-between">
					<div class="flex items-center gap-x-4 text-xs">
						<time datetime="2020-03-16" class="text-gray-500"
							>{new Date(post.created_at).toLocaleDateString()}</time
						>
					</div>
					<div class="group relative">
						<h3
							class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600"
						>
							<a href="/{post.slug}">
								<span class="absolute inset-0"></span>
								{post.title}
							</a>
						</h3>
						<p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
							{post.description}
						</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</div>
