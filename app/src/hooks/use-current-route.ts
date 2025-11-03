import { useRouterState } from "@tanstack/react-router";

export function useCurrentRoute() {
	const { matches } = useRouterState();

	return matches[matches.length - 1];
}
