<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ExternalLinkIcon } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { update_post_schema } from '$lib/schemas/form';
	import slugify from '@sindresorhus/slugify';
	import { toast } from 'svelte-sonner';
	import { Loader2Icon } from 'lucide-svelte';
	import { scale } from 'svelte/transition';
	import autoAnimate from '@formkit/auto-animate';
	import { onMount } from 'svelte';

	export let data;

	const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
		resetForm: false,
		validators: zodClient(update_post_schema),
		onError: (event) => {
			console.log(event);
			if (event.result.type === 'error') {
				toast.error(event.result.error.message);
			}
		},
		onUpdated: (event) => {
			console.log(event);
			toast.success('Post updated');
		}
	});

	const onChangeTitle = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.value && !data.post.slug) {
			$form.slug = slugify(target.value);
		}
	};

	const onChangeSlug = (event: Event) => {
		const target = event.target as HTMLInputElement;
		$form.slug = slugify(target.value);
	};

	let titleInputEl: HTMLInputElement;
	let slugInputEl: HTMLInputElement;

	onMount(() => {
		if (!$form.title) titleInputEl.focus();
	});
</script>

<form method="POST" action="?/update-post" use:enhance>
	<Card.Root>
		<Card.Header>
			<input
				bind:this={titleInputEl}
				name="title"
				type="text"
				class="bg-transparent text-4xl font-bold tracking-tight text-foreground outline-none"
				placeholder="No title"
				autocorrect="off"
				spellcheck="false"
				bind:value={$form.title}
				on:change={onChangeTitle}
			/>
			<label
				class="flex items-center rounded bg-muted px-2 py-1 transition hover:bg-muted/80"
				for="slug"
			>
				<span>http://site.platform.sernhe.dev/</span>
				<input
					bind:this={slugInputEl}
					id="slug"
					name="slug"
					type="text"
					class="w-full bg-transparent outline-none"
					bind:value={$form.slug}
					on:change={onChangeSlug}
				/>
			</label>
		</Card.Header>
		<Card.Content>
			<Separator class="mb-6"></Separator>
			<div>jek</div>
			<Separator class="mt-6"></Separator>
		</Card.Content>

		<Card.Footer>
			<Button type="submit" disabled={$submitting}>
				{#if $delayed}
					<div use:autoAnimate>
						<Loader2Icon class="mr-2 size-4 animate-spin"></Loader2Icon>
					</div>
				{/if}
				<div class="flex-1">Save</div>
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
