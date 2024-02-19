<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import { Separator } from '$lib/components/ui/separator';
	import Input from '$lib/components/form-fields/input.svelte';
</script>

<PageHeader.Root>
	<PageHeader.Title>Settings</PageHeader.Title>
</PageHeader.Root>

<Separator class="my-6" />
<div class="lg:max-w-2xl">
	<Input />
</div>
