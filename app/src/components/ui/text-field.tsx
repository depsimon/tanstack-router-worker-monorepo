import type { TextFieldProps as TextFieldPrimitiveProps } from "react-aria-components";
import { TextField as TextFieldPrimitive } from "react-aria-components";
import { cx } from "~/lib/primitive";

export interface TextFieldProps extends TextFieldPrimitiveProps {}

export const TextField = ({
	children,
	className,
	...props
}: TextFieldProps) => {
	return (
		<TextFieldPrimitive
			data-slot="text-field"
			{...props}
			className={cx(
				"group/text-field flex flex-col gap-1",
				"aria-invalid:[&_[data-slot='description']]:hidden data-invalid:[&_[data-slot='description']]:hidden",
				"[&_[data-slot='description']]:px-1",
				className,
			)}
		>
			{(values) => (
				<>{typeof children === "function" ? children(values) : children}</>
			)}
		</TextFieldPrimitive>
	);
};
