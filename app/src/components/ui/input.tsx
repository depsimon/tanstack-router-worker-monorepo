import {
	Input as InputPrimitive,
	type InputProps as InputPrimitiveProps,
} from "react-aria-components";
import { cx } from "~/lib/primitive";

export type InputProps = InputPrimitiveProps;

export function Input({ className, ...props }: InputProps) {
	return (
		<InputPrimitive
			data-slot="input"
			className={cx(
				"rounded-field border bg-field px-3 py-2 text-field-foreground text-sm shadow-field outline-none placeholder:text-field-placeholder",
				"transition",
				"border border-field-border",
				"hover:border-field-border-hover hover:bg-field-hover",
				"data-hovered:border-field-border-hover data-hovered:bg-field-hover",
				"focus-visible:status-focused focus-visible:border-field-border-focus focus-visible:bg-field-focus",
				"data-focus-visible:status-focused data-focus-visible:border-field-border-focus data-focus-visible:bg-field-focus",
				"data-invalid:border-danger data-invalid:bg-field-focus",
				className,
			)}
			{...props}
		/>
	);
}
