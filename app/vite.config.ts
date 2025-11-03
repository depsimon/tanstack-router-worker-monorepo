import { cloudflare } from "@cloudflare/vite-plugin";
import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		cloudflare({
			experimental: {},
		}),
		lingui(),
		tsConfigPaths(),
		devtools({
			enhancedLogs: {
				enabled: false,
			},
		}),
		tailwindcss(),
		tanstackRouter({ autoCodeSplitting: false, target: "react" }),
		react({
			babel: {
				plugins: ["@lingui/babel-plugin-lingui-macro"],
			},
		}),
	],
});
