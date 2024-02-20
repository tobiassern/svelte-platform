import Root from './title.svelte';
import { tv, type VariantProps } from 'tailwind-variants';

const titleVariants = tv({
	base: 'tracking-tight',
	variants: {
		size: {
			h1: 'text-4xl font-bold',
			h2: 'text-3xl font-bold',
			h3: 'text-2xl font-semibold',
			h4: 'text-xl font-semibold',
			p: ''
		}
	},
	defaultVariants: {
		size: 'h1'
	}
});

type Size = VariantProps<typeof titleVariants>['size'];

type Props = {
	element?: Size;
	size?: Size;
	class?: string;
};

export {
	Root,
	type Props,
	//
	Root as Title,
	type Props as TitleProps,
	titleVariants
};
