import type { ComponentProps } from "react";
import { Spinner } from "~/components/ui/spinner";
import { cxBase } from "~/lib/primitive";

export function Pending({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cxBase(
				"flex h-full w-full grow items-center justify-center",
				className,
			)}
			{...props}
		>
			<Spinner className="size-8 [view-transition:pending]" />
		</div>
	);
}
