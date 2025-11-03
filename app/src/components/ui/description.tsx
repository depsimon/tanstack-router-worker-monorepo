import { Text, type TextProps } from "~/components/ui/text";
import { cxBase } from "~/lib/primitive";

export type DescriptionProps = TextProps;

export function Description({ className, ...props }: DescriptionProps) {
	return (
		<Text
			data-slot="description"
			className={cxBase(
				"truncate text-wrap text-muted text-xs group-text-field:[data-invalid]:hidden",
				className,
			)}
			{...props}
		/>
	);
}
