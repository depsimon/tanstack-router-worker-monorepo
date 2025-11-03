import { queryOptions } from "@tanstack/react-query";
import { authClient } from "~/lib/auth";

export async function getUserSession() {
	const { data: session } = await authClient.getSession();

	if (!session) return null;

	return {
		user: session.user,
		session: session.session,
	};
}

export const authSessionQuery = () => {
	return queryOptions({
		queryKey: ["auth", "session"],
		queryFn: getUserSession,
		staleTime: 5_000,
	});
};
