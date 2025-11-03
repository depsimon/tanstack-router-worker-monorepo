import { Link, type LinkProps } from "@tanstack/react-router";
import type {
	SelectionIndicatorProps as SelectionIndicatorPrimitiveProps,
	TabListProps as TabListPrimitiveProps,
	TabPanelProps as TabPanelPrimitiveProps,
	TabProps as TabPrimitiveProps,
	TabsProps as TabsPrimitiveProps,
} from "react-aria-components";
import {
	composeRenderProps,
	SelectionIndicator as SelectionIndicatorPrimitive,
	TabList as TabListPrimitive,
	TabPanel as TabPanelPrimitive,
	Tab as TabPrimitive,
	Tabs as TabsPrimitive,
} from "react-aria-components";
import { cx } from "~/lib/primitive";

export const Tab = ({
	className,
	to,
	...props
}: TabPrimitiveProps & { to?: LinkProps }) => {
	const Component = to ? Link : "button";

	return (
		<TabPrimitive
			className={cx(
				"relative inline-flex h-8 items-center justify-center",
				className,
			)}
			{...props}
		>
			{composeRenderProps(props.children, (children) => (
				<>
					<Component
						{...to}
						className="z-1 inline-flex h-full w-full cursor-pointer items-center justify-center px-4 py-2"
					>
						{children}
					</Component>
					<TabIndicator />
				</>
			))}
		</TabPrimitive>
	);
};

export const TabIndicator = ({
	className,
	...props
}: SelectionIndicatorPrimitiveProps) => {
	return (
		<SelectionIndicatorPrimitive
			className={cx(
				"absolute inset-0 h-full w-full rounded-[7px] bg-white py-2 shadow-mini dark:bg-accent-soft",
				"transition-[translate,width,height] duration-300 ease-fluid-out",
				className,
			)}
			{...props}
		/>
	);
};

export const TabList = <T extends object>({
	className,
	...props
}: TabListPrimitiveProps<T>) => {
	return (
		<TabListPrimitive
			className={cx(
				"inline-grid w-full auto-cols-fr grid-flow-col gap-1 rounded-[9px] bg-surface-3 p-1 font-semibold text-sm leading-[0.01em] shadow-mini-inset dark:border dark:border-neutral-600/30 dark:bg-background",
				className,
			)}
			{...props}
		/>
	);
};

export const TabPanel = ({ className, ...props }: TabPanelPrimitiveProps) => {
	return <TabPanelPrimitive className={cx("", className)} {...props} />;
};

export const TabsRoot = ({ ...props }: TabsPrimitiveProps) => {
	return <TabsPrimitive {...props} />;
};
