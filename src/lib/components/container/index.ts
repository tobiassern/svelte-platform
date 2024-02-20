import Root from './container.svelte';
import { tv, type VariantProps } from 'tailwind-variants';

const containerVariants = tv({
	base: 'mx-auto w-full px-4 sm:px-6 lg:px-8',
	variants: {
		size: {
			sm: 'max-w-3xl',
			lg: 'max-w-7xl'
		}
	},
	defaultVariants: {
		size: 'lg'
	}
});

type Size = VariantProps<typeof containerVariants>['size'];

type Props = {
	size?: Size;
	class?: string;
};

export {
	Root,
	type Props,
	//
	Root as Container,
	type Props as ContainerProps,
	containerVariants
};
