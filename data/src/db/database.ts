import { drizzle } from "drizzle-orm/d1";
import * as schema from "../drizzle/schemas";

export type DatabaseWithSchema = ReturnType<typeof drizzle<typeof schema>>;

let db: DatabaseWithSchema | null = null;

/**
 * Initialize the DB connection
 */
export function initDatabase(bindingDb: D1Database) {
	db = drizzle(bindingDb, {
		logger: true,
		schema,
	});

	if (!bindingDb) {
		throw new Error("Database binding is missing");
	}

	return db;
}

/**
 * Get the DB connection.
 */
export function getDb() {
	if (!db) {
		throw new Error("Database not initialized");
	}

	return db;
}
