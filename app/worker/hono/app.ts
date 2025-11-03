import { type AuthenticatedSession, getAuth } from "@acme/data/auth";
import { getDb } from "@acme/data/database";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { authMiddleware } from "~/worker/hono/middlewares/auth.middleware";
import { rpcHandler } from "~/worker/orpc";

export const app = new Hono<{
	Bindings: CloudflareBindings;
	Variables: { session?: AuthenticatedSession; userId?: string };
}>()
	.use(logger())
	.use(prettyJSON())

	.use("*", cors())

	.notFound((c) => {
		return c.json({ message: "Not Found", request: c.req.url }, 404);
	})

	.use("*", async (_, next) => {
		if (process.env.NODE_ENV === "development") {
			console.log("Adding 300ms delay to all requests");

			await setTimeout(() => {}, 300);
		}

		await next();
	})

	.get("/up", async (c) => {
		const db = getDb();

		return c.json({
			db: (await db.run("SELECT 1")).success,
			result: true,
			version: c.env.CF_VERSION_METADATA,
		});
	})

	.on(["GET", "POST"], "/api/*", async (c) => {
		const auth = getAuth();

		return auth.handler(c.req.raw);
	})

	.use("/rpc/*", authMiddleware({ requireAuth: false }), async (c, next) => {
		const session = c.get("session");
		const userId = c.get("userId");

		const { matched, response } = await rpcHandler.handle(c.req.raw, {
			prefix: "/rpc",
			context: {
				env: c.env,
				session,
				userId,
			},
		});

		if (matched) {
			return c.newResponse(response.body, response);
		}

		await next();
	});

if (process.env.NODE_ENV === "development") {
	showRoutes(app);
}
