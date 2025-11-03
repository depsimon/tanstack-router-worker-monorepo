import { cxBase } from "~/lib/primitive";

const Card = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			data-slot="card"
			className={cxBase(
				"group/card flex flex-col gap-(--gutter) rounded-xl border bg-background py-(--gutter) text-foreground shadow-xs [--gutter:--spacing(6)] has-[table]:overflow-hidden has-[table]:not-has-data-[slot=card-footer]:pb-0 **:data-[slot=table-header]:bg-accent-soft/50 has-[table]:**:data-[slot=card-footer]:border-t **:[table]:overflow-hidden",
				className,
			)}
			{...props}
		/>
	);
};

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
}

const CardHeader = ({
	className,
	title,
	description,
	children,
	...props
}: HeaderProps) => (
	<div
		data-slot="card-header"
		className={cxBase(
			"grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-(--gutter) has-data-[slot=card-action]:grid-cols-[1fr_auto]",
			className,
		)}
		{...props}
	>
		{title && <CardTitle>{title}</CardTitle>}
		{description && <CardDescription>{description}</CardDescription>}
		{!title && typeof children === "string" ? (
			<CardTitle>{children}</CardTitle>
		) : (
			children
		)}
	</div>
);

const CardTitle = ({ className, ...props }: React.ComponentProps<"div">) => {
	return (
		<div
			data-slot="card-title"
			className={cxBase(
				"text-balance font-display font-semibold text-xl",
				className,
			)}
			{...props}
		/>
	);
};

const CardDescription = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			{...props}
			data-slot="card-description"
			className={cxBase(
				"row-start-2 text-pretty text-muted-fg text-sm/6",
				className,
			)}
			{...props}
		/>
	);
};

const CardAction = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			data-slot="card-action"
			className={cxBase(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
};

const CardContent = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			data-slot="card-content"
			className={cxBase("px-(--gutter) has-[table]:border-t", className)}
			{...props}
		/>
	);
};

const CardFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			data-slot="card-footer"
			className={cxBase(
				"flex items-center px-(--gutter) group-has-[table]/card:pt-(--gutter) [.border-t]:pt-6",
				className,
			)}
			{...props}
		/>
	);
};

export {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	CardAction,
};
