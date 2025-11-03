import {
	createRouterClient,
	type InferRouterInputs,
	type InferRouterOutputs,
} from "@orpc/server";
import router from "~/worker/orpc/routes";

export default router;

export type Router = typeof router;
export type Inputs = InferRouterInputs<Router>;
export type Outputs = InferRouterOutputs<Router>;

export const routerClient = createRouterClient(router, {
	context: ({ env, ...context }) => ({ env, ...context }),
});
