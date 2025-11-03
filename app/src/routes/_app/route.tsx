import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "~/components/sidebar";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
	beforeLoad({ context }) {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/auth/login" });
		}
	},
});

function RouteComponent() {
	return (
		<div className="flex h-screen w-full overflow-hidden">
			<Sidebar />
			<div className="w-full grow">
				<div className="relative h-full overflow-y-auto bg-background ring-1 ring-foreground/8">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
