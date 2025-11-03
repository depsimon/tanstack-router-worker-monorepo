import {
	Home09Icon,
	Logout01Icon,
	Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Trans } from "@lingui/react/macro";
import { Link, type LinkProps } from "@tanstack/react-router";
import { Button, type ButtonProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { authClient, useRefreshAuth } from "~/lib/auth";

export function Sidebar() {
	const { refresh } = useRefreshAuth();

	return (
		<aside className="flex w-52 flex-none flex-col py-6">
			<div className="px-4">
				<div className="flex h-7 items-center gap-2 pl-2">
					<img src="/logo-square.png" alt="ACME" className="size-5" />
					<div className="font-semibold text-foreground text-sm">ACME</div>
				</div>
			</div>

			<div className="mt-6 flex w-full grow flex-col gap-0.5 overflow-y-auto px-4 pb-4">
				<SidebarLink to="/">
					<HugeiconsIcon icon={Home09Icon} />
					<Trans>Home</Trans>
				</SidebarLink>
				<div className="mt-6 mb-4 pl-2 font-semibold text-accent-soft-foreground text-xs tracking-tight">
					<div>
						<Trans>Account</Trans>
					</div>
				</div>
				<SidebarLink to="/settings">
					<HugeiconsIcon icon={Settings01Icon} />
					<Trans>Settings</Trans>
				</SidebarLink>
			</div>
			<div className="flex w-full flex-col gap-0.5 px-4 pt-4">
				<SidebarButton
					onClick={async () => {
						await authClient.signOut();
						await refresh();
					}}
				>
					<HugeiconsIcon icon={Logout01Icon} />
					<Trans>Logout</Trans>
				</SidebarButton>
			</div>
		</aside>
	);
}

const SidebarButton = ({ className, ...props }: ButtonProps) => {
	return (
		<Button
			className={twMerge(
				"flex h-8 cursor-pointer items-center justify-start gap-2 rounded-md px-2 py-1.5 font-medium text-foreground/60 text-sm duration-100",
				"bg-transparent text-left",
				"hover:bg-accent-soft hover:text-accent-soft-foreground",
				"[&>svg]:size-4",
			)}
			{...props}
		/>
	);
};

const SidebarLink = ({
	className,
	...props
}: LinkProps & { className?: string }) => {
	return (
		<Link
			className={twMerge(
				"flex h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 font-medium text-foreground/60 text-sm duration-100",
				"data-[status=active]:bg-linear-to-b data-[status=active]:from-white data-[status=active]:to-neutral-100 data-[status=active]:text-neutral-700 data-[status=active]:shadow-xs data-[status=active]:ring-1 data-[status=active]:ring-black/5",
				"hover:bg-accent-soft hover:text-accent-soft-foreground",
				"[&>svg]:size-4",
				className,
			)}
			activeProps={{
				"data-active": true,
			}}
			{...props}
		/>
	);
};
