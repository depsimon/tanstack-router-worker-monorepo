import { os } from "@orpc/server";
import type { Context } from "~/worker/orpc/context";
import { errors } from "~/worker/orpc/errors";

export const base = os.$context<Context>().errors(errors);

export const procedure = base.use(async ({ context, next }) => {
	return next({
		context: {
			...context,
			session: context.session,
			userId: context.userId,
		},
	});
});

export const authProcedure = procedure.use(
	async ({ context, next, errors }) => {
		if (!context.userId || !context.session) {
			throw errors.UNAUTHORIZED({
				message: "You must be logged in to access this resource.",
			});
		}

		return next({
			context: {
				...context,
				session: context.session,
				userId: context.userId,
			},
		});
	},
);

export const adminProcedure = authProcedure.use(
	async ({ context, next, errors }) => {
		if (context.session?.user.role !== "admin") {
			throw errors.FORBIDDEN({
				message: "You do not have permission to access this resource.",
			});
		}

		return next({
			context: {
				...context,
			},
		});
	},
);
