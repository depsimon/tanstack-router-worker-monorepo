interface ErrorShape {
	// the message should always be a punctuated sentence
	message: string;
	// internal error code if needed
	code?: string;
	// mapped to HTTP status code
	statusCode: number;
	// mapped to HTTP status text
	error: string;
}

export const errors = {
	BAD_REQUEST: {
		message: "Bad Request.",
		statusCode: 400,
		error: "Bad Request",
	},
	UNAUTHORIZED: {
		message: "Unauthorized.",
		statusCode: 401,
		error: "Unauthorized",
	},
	FORBIDDEN: {
		message: "Forbidden.",
		statusCode: 403,
		error: "Forbidden",
	},
	NOT_FOUND: {
		message: "The resource was not found.",
		statusCode: 404,
		error: "Not Found",
	},
	METHOD_NOT_ALLOWED: {
		message: "Method not allowed.",
		statusCode: 405,
		error: "Method Not Allowed",
	},
	CONFLICT: {
		message: "Conflict.",
		statusCode: 409,
		error: "Conflict",
	},
	PAYLOAD_TOO_LARGE: {
		message: "Payload too large.",
		statusCode: 413,
		error: "Payload Too Large",
	},
	UNPROCESSABLE_ENTITY: {
		message: "Unprocessable entity.",
		statusCode: 422,
		error: "Unprocessable Entity",
	},
	INTERNAL_SERVER_ERROR: {
		message: "Internal server error.",
		statusCode: 500,
		error: "Internal Server Error",
	},
} satisfies Record<string, ErrorShape>;
