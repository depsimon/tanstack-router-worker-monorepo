import {
	Text as TextPrimitive,
	type TextProps as TextPropsPrimitive,
} from "react-aria-components";

export type TextProps = TextPropsPrimitive;

export function Text({ ...props }: TextProps) {
	return <TextPrimitive {...props} />;
}
