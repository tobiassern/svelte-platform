<script lang="ts">
	import { cn } from '$lib/utils';
	import { titleVariants, type Props } from '.';

	type $$Props = Props;

	let className: $$Props['class'] = undefined;
	export { className as class };
	export let size: $$Props['size'] = 'h1';
	export let element: $$Props['element'] = 'h1';
</script>

<svelte:element this={element} class={cn(titleVariants({ size, className }))}
	><slot /></svelte:element
>
