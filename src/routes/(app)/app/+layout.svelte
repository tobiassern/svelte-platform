<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<svelte:head>
	<title>Svelte Platform</title>
</svelte:head>
<ModeWatcher />
<Toaster />
<slot />
