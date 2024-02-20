<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';

	export let form: SuperForm<T>;
	export let field: FormPathLeaves<T>;
	export let label: string;
	export let description: string | undefined = undefined;

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<div class="grid w-full items-center gap-1.5">
	<Label for={field}>{label}</Label>
	<Textarea
		name={field}
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
	/>
	{#if description}
		<p class="text-sm text-muted-foreground">{description}</p>
	{/if}
</div>
