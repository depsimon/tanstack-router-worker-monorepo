import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type {
	ErrorFromErrorMap,
	InferContractRouterErrorMap,
} from "@orpc/contract";
import type { InferRouterInputs, RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type router from "~/worker/orpc/router";

export type ORPCErrors = ErrorFromErrorMap<
	InferContractRouterErrorMap<typeof router>
>;

export const client: RouterClient<typeof router> = createORPCClient(
	new RPCLink({
		url: `${window.location.origin}/rpc`,
	}),
);

export const orpc = createTanstackQueryUtils(client);

export type OrpcInputs = InferRouterInputs<typeof router>;
