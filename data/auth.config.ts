import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createBetterAuth } from "./src/auth";

/**
 * This instance is used for the CLI (`bun auth:generate`)
 */
export const auth: ReturnType<typeof createBetterAuth> = createBetterAuth(
	drizzleAdapter(
		{},
		{
			provider: "sqlite",

			camelCase: false,
			usePlural: true,
		},
	),
);
