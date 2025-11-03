import { integer } from "drizzle-orm/sqlite-core";

export const timestamps = {
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
};

export const softDelete = {
	deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
};
