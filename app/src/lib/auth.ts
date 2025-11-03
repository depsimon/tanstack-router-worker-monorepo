import type { Auth } from "@acme/data/auth";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { authSessionQuery } from "~/requests/auth";

export const useAuthentication = () => {
	const { data: authSession } = useSuspenseQuery(authSessionQuery());

	return { authSession, isAuthenticated: !!authSession };
};

export const useAuthenticatedUser = () => {
	const { authSession } = useAuthentication();

	if (!authSession) {
		throw new Error("User is not authenticated!");
	}

	return authSession;
};

export function useRefreshAuth() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return {
		refresh: async ({
			invalidateRouter = true,
		}: {
			invalidateRouter?: boolean;
		} = {}) => {
			await queryClient.invalidateQueries(authSessionQuery());

			if (invalidateRouter) {
				await router.invalidate();
			}
		},
	};
}

export const authClient = createAuthClient({
	basePath: "/api/auth",
	plugins: [
		inferAdditionalFields<Auth>(),

		// Authorization plugins
		adminClient(),
	],
});

export type AuthClient = typeof authClient;

export const getAuthErrorMessage = (code: string | undefined) => {
	if (!code) return null;

	const errorCodes: Record<keyof typeof authClient.$ERROR_CODES, string> = {
		USER_NOT_FOUND: "User not found",
		FAILED_TO_CREATE_USER: "Failed to create user",
		FAILED_TO_CREATE_SESSION: "Failed to create session",
		FAILED_TO_UPDATE_USER: "Failed to update user",
		FAILED_TO_GET_SESSION: "Failed to get session",
		INVALID_PASSWORD: "Invalid password",
		INVALID_EMAIL: "Invalid email",
		INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
		SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
		PROVIDER_NOT_FOUND: "Provider not found",
		INVALID_TOKEN: "Invalid token",
		ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
		FAILED_TO_GET_USER_INFO: "Failed to get user info",
		USER_EMAIL_NOT_FOUND: "User email not found",
		EMAIL_NOT_VERIFIED: "Email not verified",
		PASSWORD_TOO_SHORT: "Password too short",
		PASSWORD_TOO_LONG: "Password too long",
		USER_ALREADY_EXISTS: "User already exists",
		EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
		CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
		SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
		FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
		ACCOUNT_NOT_FOUND: "Account not found",
		USER_ALREADY_HAS_PASSWORD:
			"User already has a password. Provide that to delete the account.",
		USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
			"User already exists. Use another email.",
	};

	if (code in errorCodes) {
		return errorCodes[code as keyof typeof errorCodes];
	}

	return null;
};
