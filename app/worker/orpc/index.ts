import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { RequestHeadersPlugin } from "@orpc/server/plugins";
import router from "~/worker/orpc/router";

export const rpcHandler = new RPCHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
	plugins: [new RequestHeadersPlugin()],
});
