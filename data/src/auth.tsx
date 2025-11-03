import {
	type BetterAuthOptions,
	type BetterAuthPlugin,
	betterAuth,
} from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { getDb } from "./db/database";
import { accounts, sessions, users, verifications } from "./drizzle/schemas";
import Registration from "./emails/registration";
import { getResend } from "./resend";

const plugins = [
	// Authorization plugins
	admin(),
] satisfies Array<BetterAuthPlugin>;

const options = {
	basePath: "/api/auth",

	logger: {
		disabled: false,
		level: "debug",
	},

	onAPIError: {
		onError(error, ctx) {
			console.error("API Error:", { error, ctx });
		},
	},

	databaseHooks: {
		user: {
			create: {
				async after(user) {
					try {
						const resend = getResend();

						await resend.emails.send({
							from: "acme.com <noreply@updates.acme.com>",
							to: [user.email],
							subject: "Welcome to acme.com",
							react: (
								<Registration
									user={{
										...user,
										banned: false,
										banExpires: null,
										banReason: null,
										role: null,
										image: null,
									}}
								/>
							),
						});
					} catch (cause) {
						console.error(
							"Failed to send email notification for user registration:",
							cause,
						);
					}
				},
			},
		},
	},

	emailAndPassword: {
		autoSignIn: true,
		enabled: true,
	},

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},

	plugins,
} satisfies BetterAuthOptions;

let auth: ReturnType<typeof betterAuth<typeof options>>;

export function createBetterAuth(
	database: NonNullable<Parameters<typeof betterAuth>[0]>["database"],
): typeof auth {
	return betterAuth({
		database,

		camelCase: false,
		usePlural: true,

		...options,
	});
}

export function getAuth(): typeof auth {
	if (auth) return auth;

	auth = createBetterAuth(
		drizzleAdapter(getDb(), {
			provider: "sqlite",
			schema: {
				account: accounts,
				session: sessions,
				user: users,
				verification: verifications,
			},
		}),
	);

	return auth;
}

export type Auth = typeof auth;

export type AuthenticatedSession = Awaited<
	ReturnType<(typeof auth)["api"]["getSession"]>
>;

export type AuthenticatedSessionUser =
	NonNullable<AuthenticatedSession>["user"];
