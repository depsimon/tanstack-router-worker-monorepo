import { type } from "arktype";

const BaseQueueMessageSchema = type({
	type: "string",
	payload: "unknown",
});

// Create one schema per queue message type
export const DefaultQueueMessageSchema = BaseQueueMessageSchema.merge({
	type: "'DEFAULT'",
	payload: "string",
});

// Add as many queue message schemas as needed
export const QueueMessageSchema = type.or(DefaultQueueMessageSchema);

export type QueueMessage = typeof QueueMessageSchema.infer;
export type DefaultQueueMessage = typeof DefaultQueueMessageSchema.infer;
