<script lang="ts">
	import { cn } from '$lib/utils';
	import { containerVariants, type Props } from '.';

	type $$Props = Props;

	let className: $$Props['class'] = undefined;
	export { className as class };
	export let size: $$Props['size'] = 'lg';
</script>

<div class={cn(containerVariants({ size, className }))}>
	<slot />
</div>
