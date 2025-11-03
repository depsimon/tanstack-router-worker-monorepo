import { Trans } from "@lingui/react/macro";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Tab, TabList, TabPanel, TabsRoot } from "~/components/ui/tabs";
import { useCurrentRoute } from "~/hooks/use-current-route";
import { Route as SettingsAdvancedRoute } from "~/routes/_app/settings/advanced";
import { Route as SettingsProfileRoute } from "~/routes/_app/settings/index";
import { Route as SettingsSecurityRoute } from "~/routes/_app/settings/security";

export const Route = createFileRoute("/_app/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	const route = useCurrentRoute();

	return (
		<main className="w-full max-w-xl p-6 lg:max-w-3xl lg:p-8">
			<div className="mb-8 border-b pb-4">
				<h1 className="font-display font-semibold text-2xl text-foreground">
					<Trans>Settings</Trans>
				</h1>
				<p className="text-muted-foreground text-sm">
					<Trans>Manage your account information & security settings.</Trans>
				</p>
			</div>
			<TabsRoot selectedKey={route.id} className="space-y-12">
				<TabList aria-label="Settings Tabs" className="w-auto">
					<Tab
						id={SettingsProfileRoute.id}
						to={{ to: "/settings", preload: false }}
					>
						<Trans>Profile</Trans>
					</Tab>
					<Tab
						id={SettingsSecurityRoute.id}
						to={{ to: "/settings/security", preload: false }}
					>
						<Trans>Security</Trans>
					</Tab>
					<Tab
						id={SettingsAdvancedRoute.id}
						to={{ to: "/settings/advanced", preload: false }}
					>
						<Trans>Advanced</Trans>
					</Tab>
				</TabList>
				<TabPanel id={route.id}>
					<Outlet />
				</TabPanel>
			</TabsRoot>
		</main>
	);
}
