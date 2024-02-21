<script lang="ts">
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { Loader2Icon } from 'lucide-svelte';
	import { enhance as svkEnhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { update_cover_image_schema } from '$lib/schemas/form';
	import ImageInput from '$lib/components/form-fields/image-input.svelte';

	export let sForm: SuperValidated<Infer<typeof update_cover_image_schema>>;

	let imageInputEl: ImageInput;

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
		<ImageInput
			id="cover_image"
			name="cover_image"
			bind:value={$frm.cover_image}
			defaultImageSrc={$page.data.post.cover_image_url}
			bind:this={imageInputEl}
		/>
	</form>

	<Card.Header>
		<Card.Title>Cover Image</Card.Title>
		<Card.Description>Make your post shine with an image.</Card.Description>
		{#if $errors.cover_image}
			{#each $errors.cover_image as _err}
				<Card.Description class="text-destructive">{_err}</Card.Description>
			{/each}
		{/if}
	</Card.Header>
	{#if $frm.cover_image || $page.data.post.cover_image_url}
		<Card.Footer class="flex-col items-stretch">
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
							imageInputEl.reset();
						}}>Cancel</Button
					>
				{:else if $page.data.post.cover_image_url}
					<form
						method="POST"
						action="?/remove-cover-image"
						use:svkEnhance={() => {
							return async ({ update }) => {
								await update();
								imageInputEl.reset();
							};
						}}
					>
						<Button variant="secondary" type="submit">Remove</Button>
					</form>
				{/if}
			</div>
		</Card.Footer>
	{/if}
</Card.Root>
