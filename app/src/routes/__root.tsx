/// <reference types="vite/client" />

import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { Pending } from "~/components/pending";
import { authSessionQuery } from "~/requests/auth";
import type { AppContext } from "~/router";

export const Route = createRootRouteWithContext<AppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "ACME",
			},
		],
		links: [
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon-96x96.png",
				sizes: "96x96",
			},
			{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
			{ rel: "shortcut icon", href: "/favicon.ico" },
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{ rel: "manifest", href: "/site.webmanifest" },
		],
	}),
	component: RootComponent,
	pendingComponent: () => <Pending className="h-screen" />,
	beforeLoad: async ({ context }) => {
		const session = await context.queryClient.fetchQuery(authSessionQuery());

		return {
			...session,
			isAuthenticated: !!session,
		};
	},
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
			<TanStackDevtools
				plugins={[
					{
						name: "TanStack Query",
						render: <ReactQueryDevtoolsPanel />,
					},
					FormDevtoolsPlugin(),
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<>
			<HeadContent />
			{children}
			<Scripts />
		</>
	);
}
