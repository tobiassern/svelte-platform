<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/form-fields/input.svelte';
	import TextArea from '$lib/components/form-fields/text-area.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { Loader2Icon } from 'lucide-svelte';

	import { update_site_general_information_schema } from '$lib/schemas/form';

	export let sForm: SuperValidated<Infer<typeof update_site_general_information_schema>>;

	const form = superForm(sForm, {
		resetForm: false
	});

	const { enhance, submitting, delayed } = form;
</script>

<form method="POST" action="?/update-general-information" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>General Information</Card.Title>
			<Card.Description>Manage your sites general information</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-6">
			<Input {form} field="name" label="Name" />
			<TextArea {form} field="description" label="Description" rows="4"></TextArea>
		</Card.Content>
		<Card.Footer class="flex-col items-start">
			<Separator class="mb-6" />
			<Button disabled={$submitting} type="submit"
				>Update{#if $delayed}<Loader2Icon class="ml-2 size-4 animate-spin" />{/if}</Button
			></Card.Footer
		>
	</Card.Root>
</form>
