<script lang="ts">
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/form-fields/input.svelte';
	import TextArea from '$lib/components/form-fields/text-area.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { Loader2Icon } from 'lucide-svelte';
	import { enhance as svkEnhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { update_site_cover_image_schema } from '$lib/schemas/form';

	export let sForm: SuperValidated<Infer<typeof update_site_cover_image_schema>>;
	let coverImageInputEl: HTMLInputElement;
	let coverImagePreviewEl: HTMLImageElement;
	$: imgSrc = $page.data.site.cover_image_url;

	const handleInputChange = () => {
		console.log('Handle input change');
		if (coverImageInputEl && coverImageInputEl.files) {
			const file = coverImageInputEl.files[0];
			if (file) {
				const reader = new FileReader();
				reader.addEventListener('load', function () {
					if (reader.result) {
						imgSrc = reader.result?.toString();
					}
				});
				reader.readAsDataURL(file);
			}
		}
	};
	const form = superForm(sForm, {
		resetForm: false,
		onResult: (event) => {
			if (event.result.type === 'failure') {
				toast.error('An error occured');
			} else if (event.result.type === 'success') {
				toast.success('Cover image updated');
			}
			console.log(event);
		}
	});

	const { errors, enhance, submitting, delayed, form: frm } = form;
</script>

<Card.Root class="overflow-hidden">
	<form
		id="update-cover-image-form"
		method="POST"
		enctype="multipart/form-data"
		use:enhance
		action="?/update-cover-image"
	>
		<label for="cover_image" class="group/coverImage block cursor-pointer transition">
			<div
				class="relative flex aspect-video overflow-hidden bg-muted transition group-hover/coverImage:bg-muted/80"
			>
				{#if imgSrc}
					<img
						bind:this={coverImagePreviewEl}
						src={imgSrc}
						class="aspect-video object-cover object-center transition group-hover/coverImage:scale-110"
						alt="Cover"
						on:change={handleInputChange}
					/>
					<div
						class="absolute left-0 top-0 flex aspect-video h-full w-full items-center justify-center bg-black/50 p-3 opacity-0 backdrop-blur transition group-hover/coverImage:opacity-100"
					>
						Change cover Image
					</div>
				{:else}
					<div
						class="flex aspect-video items-center justify-center p-3 text-sm text-muted-foreground"
					>
						Upload cover image
					</div>
				{/if}
			</div>
			<input
				bind:this={coverImageInputEl}
				type="file"
				id="cover_image"
				name="cover_image"
				bind:value={$frm.cover_image}
				on:change={handleInputChange}
				hidden
			/>
		</label>
	</form>
	<Card.Header>
		<Card.Title>Cover Image</Card.Title>
		<Card.Description>Set your personal touch to your site with a cover image.</Card.Description>
		{#if $errors.cover_image}
			{#each $errors.cover_image as _err}
				<Card.Description class="text-destructive">{_err}</Card.Description>
			{/each}
		{/if}
	</Card.Header>
	{#if $frm.cover_image || $page.data.site.cover_image_url}
		<Card.Footer class="flex-col items-stretch">
			<Separator class="mb-6"></Separator>
			<div class="flex gap-6">
				{#if $frm.cover_image}
					<Button type="submit" form="update-cover-image-form" disabled={$submitting}
						>Update{#if $delayed}<Loader2Icon class="ml-2 size-4 animate-spin" />{/if}</Button
					>

					<Button
						variant="secondary"
						type="button"
						on:click={() => {
							form.reset();
							$frm.cover_image = null;
							imgSrc = $page.data.site.cover_image_url;
							coverImageInputEl.value = '';
						}}>Cancel</Button
					>
				{:else if $page.data.site.cover_image_url}
					<form method="POST" action="?/remove-cover-image" use:svkEnhance>
						<Button variant="secondary" type="submit">Remove</Button>
					</form>
				{/if}
			</div>
		</Card.Footer>
	{/if}
</Card.Root>
