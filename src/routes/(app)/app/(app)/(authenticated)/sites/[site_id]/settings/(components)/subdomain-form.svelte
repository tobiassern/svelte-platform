<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/form-fields/input.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { PUBLIC_HOST } from '$env/static/public';
	import Loader2Icon from 'lucide-svelte/icons/loader-2';
	import { cn } from '$lib/utils';
	import { scale } from 'svelte/transition';

	import { update_subdomain_schema } from '$lib/schemas/form';

	export let sForm: SuperValidated<Infer<typeof update_subdomain_schema>>;

	const form = superForm(sForm, {
		resetForm: false
	});

	const { enhance, submitting, delayed } = form;
</script>

<form method="POST" action="?/update-subdomain" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>Subdomain</Card.Title>
			<Card.Description>This is the subdomain for your site.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Input {form} field="subdomain" label="Subdomain" addonRight=".{PUBLIC_HOST}" />
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
