import {
	AlertCircleIcon,
	CheckmarkCircle02Icon,
	InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cxBase } from "~/lib/primitive";

export interface NoteProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	intent?: "default" | "info" | "warning" | "danger" | "success";
	indicator?: boolean;
}

export function Note({
	indicator = true,
	intent = "default",
	className,
	...props
}: NoteProps) {
	const iconMap: Record<string, IconSvgElement | null> = {
		info: InformationCircleIcon,
		warning: AlertCircleIcon,
		danger: AlertCircleIcon,
		success: CheckmarkCircle02Icon,
		default: null,
	};

	const intentIcon = iconMap[intent] || null;

	return (
		<div
			data-slot="note"
			className={cxBase([
				"grid w-full grid-cols-[auto_1fr] overflow-hidden rounded-lg border border-current/15 p-[calc(--spacing(4)-1px)] backdrop-blur-2xl sm:text-sm/6",
				"*:[a]:hover:underline **:[strong]:font-medium",
				intent === "default" && "bg-accent-soft/50 text-accent-soft-foreground",
				intent === "info" &&
					"bg-info-soft text-info-soft-foreground **:[.text-muted-fg]:text-info-soft-foreground/70",
				intent === "warning" &&
					"bg-warning-soft text-warning-soft-foreground **:[.text-muted-fg]:text-warning-soft-foreground/80",
				intent === "danger" &&
					"bg-danger-soft text-danger-soft-foreground **:[.text-muted-fg]:text-danger-soft-foreground/80",
				intent === "success" &&
					"bg-success-soft text-success-soft-foreground **:[.text-muted-fg]:text-success-soft-foreground/80",
				className,
			])}
			{...props}
		>
			{intentIcon && indicator && (
				<div
					className={cxBase(
						"mr-3 grid size-8 place-content-center rounded-full border-2",
						intent === "warning" && "border-warning-soft-foreground/40",
						intent === "success" && "border-success-soft-foreground/40",
						intent === "danger" && "border-danger-soft-foreground/40",
						intent === "info" && "border-info-soft-foreground/40",
					)}
				>
					<div
						className={cxBase(
							"grid size-6 place-content-center rounded-full border-2",
							intent === "warning" && "border-warning-soft-foreground/85",
							intent === "success" && "border-success-soft-foreground/85",
							intent === "danger" && "border-danger-soft-foreground/85",
							intent === "info" && "border-info-soft-foreground/85",
						)}
					>
						<HugeiconsIcon icon={intentIcon} className="size-5 shrink-0" />
					</div>
				</div>
			)}
			<div
				className={cxBase(
					"text-pretty text-base/5 group-has-data-[slot=icon]:col-start-2 sm:text-sm/5",
					intent !== "default" && "pt-1",
				)}
			>
				{props.children}
			</div>
		</div>
	);
}
