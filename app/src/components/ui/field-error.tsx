import {
	FieldError as FieldErrorPrimitive,
	type FieldErrorProps as FieldErrorPrimitiveProps,
} from "react-aria-components";
import { cx } from "~/lib/primitive";

export type FieldErrorProps = FieldErrorPrimitiveProps;

export function FieldError({ children, className, ...props }: FieldErrorProps) {
	return (
		<FieldErrorPrimitive
			data-visible
			className={cx(
				"truncate px-1 text-danger text-xs opacity-0 data-[visible=true]:opacity-100",
				className,
			)}
			{...props}
		>
			{children}
		</FieldErrorPrimitive>
	);
}
