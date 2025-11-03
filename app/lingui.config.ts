import { defineConfig } from "@lingui/cli";
import type { LinguiConfig } from "@lingui/conf";

export const config = {
	catalogs: [
		{
			include: ["src"],
			path: "<rootDir>/src/locales/{locale}/messages",
		},
	],
	locales: ["fr", "en"],
	sourceLocale: "en",
} satisfies LinguiConfig;

export default defineConfig(config);
