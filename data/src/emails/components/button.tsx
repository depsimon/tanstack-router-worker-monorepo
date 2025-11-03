import { Button as ButtonPrimitive } from "@react-email/components";

export function Button({
	className,
	...props
}: React.ComponentProps<typeof ButtonPrimitive>) {
	return (
		<ButtonPrimitive
			className={`rounded bg-black px-4 py-2 text-sm text-white ${className}`}
			{...props}
		/>
	);
}
