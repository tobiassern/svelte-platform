<script>
	import '../app.pcss';
	import Modal from '$lib/components/modal/modal.svelte';
</script>

<div data-vaul-drawer-wrapper class="bg-white min-h-dvh">
	<slot />
	<Modal></Modal>
</div>
