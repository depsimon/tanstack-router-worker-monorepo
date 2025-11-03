import {
	Button as ButtonPrimitive,
	type ButtonProps as ButtonPrimitiveProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { cx } from "~/lib/primitive";

export const buttonStyles = tv({
	base: [
		"relative isolate cursor-pointer",
		"origin-center transition transform-gpu select-none whitespace-nowrap",
		"inline-flex items-center justify-center gap-2",
		"text-sm font-medium",
		"rounded-xl border border-transparent",
		"focus-visible:status-focused",
		"disabled:status-disabled [aria-disabled='true']:status-disabled",
		"data-pending:status-pending data-pending:opacity-50",
		"active:scale-97 data-pressed:scale-97",
		"*:data-[slot=icon]:pointer-events-none *:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4",
	],
	variants: {
		intent: {
			primary:
				"bg-accent text-accent-foreground hover:bg-accent-hover data-hovered:bg-accent-hover",
			secondary:
				"bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover data-hovered:bg-accent-soft-hover",
			warning:
				"bg-warning text-warning-foreground hover:bg-warning-hover data-hovered:bg-warning-hover",
			danger:
				"bg-danger text-danger-foreground hover:bg-danger-hover data-hovered:bg-danger-hover",
			outline:
				"border-border bg-default text-default-foreground hover:bg-default-hover data-hovered:bg-default-hover",
			plain:
				"bg-transparent text-accent-soft-foreground hover:bg-accent-soft data-hovered:bg-accent-soft",
		},
		size: {
			sm: ["h-9 px-3 md:h-8", "*:data-[slot=icon]:size-4"],
			md: ["h-10 px-4 md:h-9"],
			lg: ["h-11 text-base px-4 md:h-10"],
			"sq-sm": ["touch-target size-9 sm:size-8"],
			"sq-md": ["touch-target size-10 sm:size-9"],
			"sq-lg": ["touch-target size-11 sm:size-10"],
		},
		isCircle: {
			true: "rounded-full",
			false: "rounded-xl",
		},
	},
	defaultVariants: {
		intent: "primary",
		size: "md",
		isCircle: false,
	},
});

export interface ButtonProps
	extends ButtonPrimitiveProps,
		VariantProps<typeof buttonStyles> {
	ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
	className,
	intent,
	size,
	isCircle,
	ref,
	...props
}: ButtonProps) {
	return (
		<ButtonPrimitive
			ref={ref}
			{...props}
			className={cx(
				buttonStyles({
					intent,
					size,
					isCircle,
				}),
				className,
			)}
		/>
	);
}
