<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/form-fields/input.svelte';
	import { superForm } from 'sveltekit-superforms';

	import Loader2Icon from 'lucide-svelte/icons/loader-2';

	import { update_custom_domain_schema } from '$lib/schemas/form';

	export let sForm: SuperValidated<Infer<typeof update_custom_domain_schema>>;

	const form = superForm(sForm, {
		resetForm: false
	});

	const { enhance, submitting, delayed } = form;
</script>

<form method="POST" action="?/update-custom-domain" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>Custom domain</Card.Title>
			<Card.Description>Use your own custom domain.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Input {form} field="custom_domain" label="Custom domain" />
		</Card.Content>
		<Card.Footer class="flex-col items-start">
			<Separator class="mb-6" />
			<Button disabled={$submitting} type="submit"
				>Update
				{#if $delayed}
					<Loader2Icon class="ml-2 size-4 animate-spin" />
				{/if}</Button
			></Card.Footer
		>
	</Card.Root>
</form>
