<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import {
		FloatingMenuPlugin,
		type FloatingMenuPluginProps
	} from '@tiptap/extension-floating-menu';
	import { onMount, onDestroy } from 'svelte';

	import EditorMenu from './editor-menu.svelte';

	export let editor: Editor;

	let isNodeStyleOpen = false;
	let element: HTMLElement;
	let pluginKey: FloatingMenuPluginProps['pluginKey'] = 'svelte-tiptap-floating-menu';
	let tippyOptions: FloatingMenuPluginProps['tippyOptions'] = {
		moveTransition: 'transform 0.15s ease-out',
		onHidden: () => {
			isNodeStyleOpen = false;
		}
	};

	onMount(() => {
		const plugin = FloatingMenuPlugin({
			pluginKey,
			editor,
			element,
			tippyOptions
		});

		editor.registerPlugin(plugin);
	});

	onDestroy(() => {
		editor.unregisterPlugin(pluginKey);
	});
</script>

<EditorMenu {editor} bind:element />
