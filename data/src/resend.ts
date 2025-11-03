import { Resend } from "resend";

let resend: Resend | null = null;

/**
 * Initialize the email connection
 */
export function initResend(apiKey: string) {
	resend = new Resend(apiKey);

	if (!resend) {
		throw new Error("Email connection is missing");
	}

	return resend;
}

/**
 * Get the Resend connection.
 */
export function getResend() {
	if (!resend) {
		throw new Error("Resend not initialized");
	}

	return resend;
}
