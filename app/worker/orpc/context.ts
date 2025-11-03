import type { AuthenticatedSession } from "@acme/data/auth";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";

export interface Context extends RequestHeadersPluginContext {
	env: CloudflareBindings;
	session?: AuthenticatedSession;
	userId?: string;
}
