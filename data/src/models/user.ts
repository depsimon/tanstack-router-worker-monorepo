import type { users } from "../drizzle/schemas";

export type User = typeof users.$inferSelect;
