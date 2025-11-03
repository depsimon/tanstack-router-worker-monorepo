import { WorkerEntrypoint } from "cloudflare:workers";
import { initDatabase } from "@acme/data/database";
import { QueueMessageSchema } from "@acme/data/queues/types";
import { initResend } from "@acme/data/resend";
import { type } from "arktype";
import { app } from "~/worker/hono/app";
import { handleDefaultQueue } from "~/worker/queues/default";

export default class TanstackInfoBackend extends WorkerEntrypoint<CloudflareBindings> {
	constructor(ctx: ExecutionContext, env: CloudflareBindings) {
		super(ctx, env);

		initDatabase(env.DB);
		initResend(env.RESEND_API_KEY);
	}

	override async fetch(request: Request) {
		return app.fetch(request, this.env, this.ctx);
	}

	override async scheduled(controller: ScheduledController): Promise<void> {
		this.fetch;
		switch (controller.cron) {
			case "* * * * *":
				console.log("cron processed");
				break;
			default:
				console.log("Unhandled cron expression:", controller);
		}
	}

	override async queue(batch: MessageBatch<unknown>): Promise<void> {
		for (const message of batch.messages) {
			const parsedEvent = QueueMessageSchema(message.body);

			if (parsedEvent instanceof type.errors) {
				console.error("Invalid queue message:", parsedEvent);
			} else {
				switch (parsedEvent.type) {
					default:
						console.log("Unhandled queue message type:", parsedEvent.type);
						await handleDefaultQueue(this.env, parsedEvent);
				}
			}
		}
	}
}
