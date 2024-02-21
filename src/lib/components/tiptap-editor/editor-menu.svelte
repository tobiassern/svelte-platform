<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Toggle } from '$lib/components/ui/toggle';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import BoldIcon from 'lucide-svelte/icons/bold';
	import ItalicIcon from 'lucide-svelte/icons/italic';
	import StrikethroughIcon from 'lucide-svelte/icons/strikethrough';
	import ListOrderedIcon from 'lucide-svelte/icons/list-ordered';
	import ListIcon from 'lucide-svelte/icons/list';
	import type { Editor } from '@tiptap/core';
	import { cn } from '$lib/utils';

	export let element: HTMLElement;
	export let editor: Editor;
	let className: HTMLElement['className'] | undefined = undefined;
	export { className as class };

	let isNodeStyleOpen = false;
</script>

<div
	bind:this={element}
	class={cn(
		'not-prose relative flex items-center gap-0.5 rounded-md border bg-background p-1 shadow',
		className
	)}
>
	<Popover.Root portal={null} bind:open={isNodeStyleOpen}>
		<Popover.Trigger asChild let:builder>
			<Button variant="ghost" size="sm" type="button" builders={[builder]}>
				{#if editor.isActive('heading', { level: 1 })}
					Heading 1
				{:else if editor.isActive('heading', { level: 2 })}
					Heading 2
				{:else if editor.isActive('heading', { level: 3 })}
					Heading 3
				{:else if editor.isActive('paragraph')}
					Paragraph
				{:else}
					<span class="italic">Multiple</span>
				{/if}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="z-50 flex flex-col space-y-0.5 px-2 py-1" align="start" sameWidth={true}>
			<Button
				type="button"
				size="sm"
				variant="ghost"
				on:click={() => {
					editor.chain().focus().setHeading({ level: 1 }).run();
					isNodeStyleOpen = false;
				}}>Heading 1</Button
			>
			<Button
				type="button"
				size="sm"
				variant="ghost"
				on:click={() => {
					editor.chain().focus().setHeading({ level: 2 }).run();
					isNodeStyleOpen = false;
				}}>Heading 2</Button
			>
			<Button
				type="button"
				size="sm"
				variant="ghost"
				on:click={() => {
					editor.chain().focus().setHeading({ level: 3 }).run();
					isNodeStyleOpen = false;
				}}>Heading 3</Button
			>
			<Button
				type="button"
				size="sm"
				variant="ghost"
				on:click={() => {
					editor.chain().focus().setParagraph().run();
					isNodeStyleOpen = false;
				}}>Paragraph</Button
			>
		</Popover.Content>
	</Popover.Root>
	<Separator orientation="vertical" class="mx-1 h-6" />
	<Toggle
		size="sm"
		pressed={editor?.isActive('bold')}
		onPressedChange={(val) => {
			if (val) {
				editor.chain().focus().setBold().run();
			} else {
				editor.chain().focus().unsetBold().run();
			}
		}}
	>
		<BoldIcon class="h-4 w-4" />
	</Toggle>
	<Toggle
		size="sm"
		pressed={editor?.isActive('italic')}
		onPressedChange={(val) => {
			if (val) {
				editor.chain().focus().setItalic().run();
			} else {
				editor.chain().focus().unsetItalic().run();
			}
		}}
	>
		<ItalicIcon class="h-4 w-4" />
	</Toggle>
	<Toggle
		size="sm"
		pressed={editor?.isActive('strike')}
		onPressedChange={(val) => {
			if (val) {
				editor.chain().focus().setStrike().run();
			} else {
				editor.chain().focus().unsetStrike().run();
			}
		}}
	>
		<StrikethroughIcon class="h-4 w-4" />
	</Toggle>
	<Toggle
		size="sm"
		pressed={editor?.isActive('orderedList')}
		onPressedChange={() => {
			editor.chain().focus().toggleOrderedList().run();
		}}
	>
		<ListOrderedIcon class="h-4 w-4" />
	</Toggle>
	<Toggle
		size="sm"
		pressed={editor?.isActive('bulletList')}
		onPressedChange={() => {
			editor.chain().focus().toggleBulletList().run();
		}}
	>
		<ListIcon class="h-4 w-4" />
	</Toggle>
</div>
