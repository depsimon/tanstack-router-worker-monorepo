import type { I18n } from "@lingui/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { ErrorPage } from "~/components/error-page";
import { Pending } from "~/components/pending";
import { routerWithLingui } from "~/integrations/lingui";
import { routeTree } from "~/routeTree.gen";

export interface AppContext {
	i18n: I18n;
	queryClient: QueryClient;
}

export function createRouter({ i18n }: { i18n: I18n }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 60_000, // 1 minute
			},
		},
	});

	const router = routerWithLingui(
		createTanStackRouter({
			routeTree,
			context: {
				i18n,
				queryClient,
			},
			defaultPreload: "intent",
			defaultNotFoundComponent: (_props) => (
				<ErrorPage error={new Error("Not Found")} reset={() => {}} />
			),
			defaultPendingComponent: Pending,
			defaultPendingMinMs: 100,
			defaultPendingMs: 100,
			defaultErrorComponent: (props) => <ErrorPage {...props} />,
			scrollRestoration: true,
			trailingSlash: "never",
			Wrap: ({ children }) => (
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			),
		}),
		i18n,
	);

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
