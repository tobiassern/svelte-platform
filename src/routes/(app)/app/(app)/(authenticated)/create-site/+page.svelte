<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Loader2Icon } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { create_site_schema } from '$lib/schemas/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	export let data;

	const { form, enhance, submitting, delayed, constraints } = superForm(data.form, {
		validators: zodClient(create_site_schema),
		onError: (event) => {
			console.log(event);
		},
		onUpdated: (event) => {
			console.log(event);
		}
	});

	$: console.log($form);
</script>

<div class="flex h-full items-center justify-center">
	<form class="contents" action="?/create-site" method="POST" use:enhance>
		<Card.Root class="w-full max-w-md">
			<Card.Header>
				<Card.Title>Create site</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="name">Name</Label>
					<Input
						type="text"
						id="name"
						name="name"
						placeholder="Site name"
						bind:value={$form.name}
						{...$constraints.name}
					/>
				</div>
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="subdomain">Public domain</Label>
					<Input
						type="text"
						id="subdomain"
						name="subdomain"
						placeholder=""
						bind:value={$form.subdomain}
						{...$constraints.subdomain}
					/>
				</div>
			</Card.Content>
			<Card.Footer
				class="flex-col items-stretch justify-between gap-3 lg:flex-row-reverse lg:items-center"
			>
				<Button disabled={$submitting} type="submit"
					>{#if $delayed}<Loader2Icon class="mr-2 size-4 animate-spin"
						></Loader2Icon>{/if}Create</Button
				>
				<Button variant="outline" href="/">Go back</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
