import type { Config } from "drizzle-kit";

// This is used in order to reset the database with `bun db:fresh`

const config: Config = {
	schema: "./empty.schema.ts",
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
