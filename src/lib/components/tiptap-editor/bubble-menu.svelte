<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
	import { onMount, onDestroy } from 'svelte';
	import EditorMenu from './editor-menu.svelte';

	export let editor: Editor;

	let isNodeStyleOpen = false;
	let element: HTMLElement;
	let pluginKey: BubbleMenuPluginProps['pluginKey'] = 'svelte-tiptap-bubble-menu';
	let tippyOptions: BubbleMenuPluginProps['tippyOptions'] = {
		moveTransition: 'transform 0.15s ease-out',
		onHidden: () => {
			isNodeStyleOpen = false;
		}
	};
	let shouldShow: BubbleMenuPluginProps['shouldShow'] = ({ editor }) => {
		// don't show if image is selected
		// if (editor.isActive('image')) {
		// 	return false;
		// }
		return editor.view.state.selection.content().size > 0;
	};

	let updateDelay: BubbleMenuPluginProps['updateDelay'] = 250;

	onMount(() => {
		const plugin = BubbleMenuPlugin({
			pluginKey,
			editor,
			element,
			tippyOptions,
			shouldShow,
			updateDelay
		});

		editor.registerPlugin(plugin);
	});

	onDestroy(() => {
		editor.unregisterPlugin(pluginKey);
	});
</script>

<EditorMenu bind:element {editor} />
