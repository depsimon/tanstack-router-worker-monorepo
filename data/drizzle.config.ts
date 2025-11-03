import type { Config } from "drizzle-kit";

const config: Config = {
	schema: "./src/drizzle/schemas",
	out: "./src/drizzle/migrations",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
		token: process.env.CLOUDFLARE_D1_TOKEN!,
	},
	tablesFilter: ["!_cf_KV"],
};

export default config satisfies Config;
