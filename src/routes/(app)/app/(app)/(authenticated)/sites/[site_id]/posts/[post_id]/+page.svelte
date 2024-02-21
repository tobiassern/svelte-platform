<script lang="ts">
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { update_post_schema } from '$lib/schemas/form';
	import slugify from '@sindresorhus/slugify';
	import { toast } from 'svelte-sonner';
	import { Loader2Icon } from 'lucide-svelte';
	import autoAnimate from '@formkit/auto-animate';
	import PublishPostForm from './(components)/publish-post-form.svelte';
	import { TiptapEditor } from '$lib/components/tiptap-editor';
	import { PUBLIC_HOST } from '$env/static/public';
	import { CopyIcon, ExternalLinkIcon } from 'lucide-svelte';
	import CoverImageForm from './(components)/cover-image-form.svelte';

	export let data;

	let tiptapEditorEl: TiptapEditor;

	const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
		dataType: 'json',
		resetForm: false,
		validators: zodClient(update_post_schema),
		onSubmit: (event) => {
			const content_html = tiptapEditorEl.getHtml();
			const content_json = tiptapEditorEl.getJson();
			$form.content_html = content_html;
			$form.content_json = content_json;
		},
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

	const siteUrl = `${$page.url.protocol}//${data.site.subdomain}.${PUBLIC_HOST}`;
</script>

<form id="update-post-form" method="POST" action="?/update-post" use:enhance />

<div class="post-editor-layout">
	<Card.Root style="grid-area: header;">
		<Card.Header>
			<Card.Title
				><input
					form="update-post-form"
					name="title"
					type="text"
					class="w-full bg-transparent text-foreground outline-none placeholder:italic"
					placeholder="Edit title..."
					autocorrect="off"
					spellcheck="false"
					bind:value={$form.title}
					on:change={onChangeTitle}
				/></Card.Title
			>
			<Card.Description
				><textarea
					rows="3"
					form="update-post-form"
					class="w-full bg-background outline-none placeholder:italic"
					style="field-sizing: content;"
					bind:value={$form.description}
					placeholder="Edit description..."
				></textarea></Card.Description
			>
			<div class="flex items-center justify-between gap-3">
				<label
					for="slug"
					class="flex flex-1 rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground transition hover:bg-muted/50"
					>{siteUrl}/<input
						on:change={onChangeSlug}
						id="slug"
						form="update-post-form"
						class="bg-transparent px-0 outline-none"
						name="slug"
						value={$form.slug}
					/>
				</label>
				<Button
					size="icon"
					variant="ghost"
					on:click={() => {
						navigator.clipboard.writeText(`${siteUrl}/${data.post.slug}`);
					}}><CopyIcon class="size-4" /></Button
				>
				<Button size="icon" variant="ghost" href="{siteUrl}/{data.post.slug}"
					><ExternalLinkIcon class="size-4" /></Button
				>
			</div>
		</Card.Header>
	</Card.Root>
	<div style="grid-area: content;">
		<Card.Root>
			<TiptapEditor bind:this={tiptapEditorEl} content={$form.content_json} />
		</Card.Root>
	</div>
	<div style="grid-area: sidebar;" class="space-y-6">
		<CoverImageForm sForm={data.cover_image_form} />
		<Card.Root>
			<Card.Content class="pt-6">
				<p class="text-sm text-muted-foreground">
					Created: {new Date(data.post.created_at).toLocaleString()}
				</p>
				<Separator class="my-6"></Separator>
				<div class="flex flex-col justify-between gap-3 lg:flex-row-reverse">
					<Button type="submit" form="update-post-form" disabled={$submitting}>
						{#if $delayed}
							<div use:autoAnimate>
								<Loader2Icon class="mr-2 size-4 animate-spin"></Loader2Icon>
							</div>
						{/if}
						<div class="flex-1">Update</div>
					</Button>
					<PublishPostForm sForm={data.publish_form} />
				</div>
			</Card.Content>
			<Card.Footer class="justify-end bg-muted pt-6">
				<form action="?/delete-post" method="POST">
					<Button variant="destructive" type="submit">Delete</Button>
				</form>
			</Card.Footer>
		</Card.Root>
	</div>
</div>

<style lang="postcss">
	.post-editor-layout {
		@apply flex flex-col gap-6;
	}
	@media (min-width: 1024px) {
		.post-editor-layout {
			@apply grid;
			grid-template-rows: auto 1fr;
			grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
			grid-template-areas:
				'header header header header header sidebar sidebar sidebar'
				'content content content content content sidebar sidebar sidebar';
		}
	}
</style>
