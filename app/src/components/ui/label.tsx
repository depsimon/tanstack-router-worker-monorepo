import {
	Label as LabelPrimitive,
	type LabelProps as LabelPrimitiveProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

export type LabelProps = LabelPrimitiveProps &
	VariantProps<typeof labelVariants>;

const labelVariants = tv({
	base: "text-foreground text-sm font-medium",
	variants: {
		isDisabled: {
			true: "status-disabled",
		},
		isInvalid: {
			true: "text-danger",
		},
		isRequired: {
			true: "after:text-danger after:ml-0.5 after:content-['*']",
		},
	},
	defaultVariants: {
		isDisabled: false,
		isInvalid: false,
		isRequired: false,
	},
});

export function Label({
	className,
	isDisabled,
	isInvalid,
	isRequired,
	...props
}: LabelProps) {
	return (
		<LabelPrimitive
			data-slot="label"
			className={labelVariants({
				isDisabled,
				isInvalid,
				isRequired,
				className,
			})}
			{...props}
		/>
	);
}
