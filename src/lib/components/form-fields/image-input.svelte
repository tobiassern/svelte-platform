<script lang="ts">
	let imageInputEl: HTMLInputElement;
	let imagePreviewEl: HTMLImageElement;

	export let defaultImageSrc: string | null | undefined;

	export let value: File | null;
	export let name: string;
	export let id: string;

	let imgSrc = defaultImageSrc;

	const handleInputChange = () => {
		if (imageInputEl && imageInputEl.files) {
			const file = imageInputEl.files[0];
			if (file) {
				const reader = new FileReader();
				reader.addEventListener('load', function () {
					if (reader.result) {
						imgSrc = reader.result?.toString();
					}
				});
				reader.readAsDataURL(file);
			}
		}
	};

	export const reset = () => {
		imgSrc = defaultImageSrc;
		imageInputEl.value = '';
	};
</script>

<label for={id} class="group/imageInput block cursor-pointer transition">
	<div
		class="relative flex aspect-video overflow-hidden bg-muted transition group-hover/imageInput:bg-muted/80"
	>
		{#if imgSrc}
			<img
				bind:this={imagePreviewEl}
				src={imgSrc}
				class="h-full w-full object-cover object-center transition group-hover/imageInput:scale-110"
				alt="Preview"
				on:change={handleInputChange}
			/>
			<div
				class="absolute left-0 top-0 flex aspect-video h-full w-full items-center justify-center bg-black/50 p-3 text-muted-foreground opacity-0 backdrop-blur transition group-hover/imageInput:opacity-100"
			>
				Change cover Image
			</div>
		{:else}
			<div
				class="flex aspect-video h-full w-full items-center justify-center p-3 text-sm text-muted-foreground"
			>
				Upload cover image
			</div>
		{/if}
	</div>
	<input
		bind:this={imageInputEl}
		type="file"
		{id}
		{name}
		bind:value
		on:change={handleInputChange}
		hidden
	/>
</label>
