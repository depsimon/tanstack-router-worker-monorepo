import { getDb } from "@acme/data/database";
import { procedure } from "~/worker/orpc/procedures";

export const health = {
	up: procedure.handler(async () => {
		const db = getDb();

		return {
			status: "ok",
			db: await db.run("SELECT 1"),
		};
	}),
};
