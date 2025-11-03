import type { QueueMessage } from "@acme/data/queues/types";

export async function handleDefaultQueue(
	_env: CloudflareBindings,
	message: QueueMessage,
) {
	console.log("Unhandled queue message type:", message);
}
