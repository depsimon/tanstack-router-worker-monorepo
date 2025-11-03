import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
	loader({ context }) {
		if (context.isAuthenticated) {
			throw redirect({ to: "/" });
		}
	},
});
