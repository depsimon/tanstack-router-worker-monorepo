import { getAuth } from "@acme/data/auth";
import { createMiddleware } from "hono/factory";

export const authMiddleware = ({
	requireAuth = true,
}: {
	requireAuth: boolean;
}) =>
	createMiddleware(async (c, next) => {
		const auth = getAuth();

		const session = await auth.api.getSession({ headers: c.req.raw.headers });

		if (!session?.user && requireAuth) {
			return c.text("Unauthorized", 401);
		}

		c.set("userId", session?.user.id);
		c.set("session", session);

		await next();
	});
