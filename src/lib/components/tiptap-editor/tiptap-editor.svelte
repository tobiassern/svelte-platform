<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import BubbleMenu from './bubble-menu.svelte';
	import FloatingMenu from './floating-menu.svelte';
	import { Placeholder } from '@tiptap/extension-placeholder';

	let element: HTMLDivElement;
	let editor: Editor;
	export let content: any = '';

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit, Placeholder.configure({ placeholder: 'Edit content...' })],
			content: null,
			editorProps: {
				attributes: {
					class: 'prose dark:prose-invert prose-sm sm:prose-base m-5 focus:outline-none'
				}
			},
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	export const getJson = () => {
		const json = editor.getJSON();

		return json;
	};

	export const getHtml = () => {
		const html = editor.getHTML();

		return html;
	};
</script>

<div bind:this={element} />
{#if editor && editor.isEditable}
	<BubbleMenu {editor} />
	<FloatingMenu {editor}></FloatingMenu>
{/if}

<style lang="postcss">
	:global(.tiptap:not(.ProseMirror-focused) p.is-editor-empty:first-child::before) {
		@apply pointer-events-none italic text-muted-foreground;
		content: attr(data-placeholder);
		float: left;
		height: 0;
	}
</style>
