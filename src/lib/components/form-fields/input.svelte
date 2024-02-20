<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';

	export let form: SuperForm<T>;
	export let field: FormPathLeaves<T>;
	export let label: string;
	export let description: string | undefined = undefined;
	export let addonRight: string | undefined = undefined;

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<div class="grid w-full items-center gap-1.5">
	<Label for={field}>{label}</Label>
	<div class="flex">
		<Input
			class={cn(addonRight && 'z-10 rounded-r-none')}
			name={field}
			aria-invalid={$errors ? 'true' : undefined}
			bind:value={$value}
			{...$constraints}
			{...$$restProps}
		/>
		{#if addonRight}
			<div class="rounded-r-md border border-input bg-muted px-3 py-2 text-sm">{addonRight}</div>
		{/if}
	</div>
	{#if description}
		<p class="text-sm text-muted-foreground">{description}</p>
	{/if}
</div>
