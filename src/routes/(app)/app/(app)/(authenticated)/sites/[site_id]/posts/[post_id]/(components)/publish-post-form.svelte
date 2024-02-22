<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button';
	import { publish_post_schema } from '$lib/schemas/form';
	import { superForm } from 'sveltekit-superforms';
	import Loader2Icon from 'lucide-svelte/icons/loader-2';
	import { toast } from 'svelte-sonner';

	export let sForm: SuperValidated<Infer<typeof publish_post_schema>>;

	const frm = superForm(sForm, {
		resetForm: false,
		onResult: (event) => {
			if (event.result.type === 'success') {
				toast.success(
					`Post ${event.result.data?.publish_form.data.published ? 'published' : 'unpublished'}`
				);
			}
		}
	});
	const { enhance, form, delayed, submitting } = frm;
</script>

<form action="?/publish-post" method="POST" use:enhance class="contents">
	<input name="published" value={!$form.published} hidden />
	<Button variant="outline" type="submit" disabled={$submitting}
		>{#if $delayed}<Loader2Icon class="mr-2 size-4 animate-spin" />{/if}{$form.published
			? 'Unpublish'
			: 'Publish'}</Button
	>
</form>
