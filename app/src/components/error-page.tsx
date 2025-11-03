import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Trans } from "@lingui/react/macro";
import { isDefinedError } from "@orpc/client";
import {
	type ErrorComponentProps,
	Link,
	useCanGoBack,
	useRouter,
} from "@tanstack/react-router";
import { Button, buttonStyles } from "~/components/ui/button";
import type { ORPCErrors } from "~/lib/orpc";

export function ErrorPage(props: ErrorComponentProps) {
	const router = useRouter();
	const canGoBack = useCanGoBack();

	let status = 500;
	let message = "An unexpected error occurred";

	const orpcError = props.error as ORPCErrors;
	if (isDefinedError(orpcError)) {
		status = orpcError.status;
		message = orpcError.message;
	}

	return (
		<div className="items-top relative isolate flex min-h-screen justify-center sm:items-center sm:pt-0">
			<div
				aria-hidden
				className="absolute inset-0 isolate hidden contain-strict lg:block"
			>
				<div className="-translate-y-87.5 -rotate-45 pointer-events-none absolute top-0 left-0 h-320 w-140 select-none rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
				<div className="-rotate-45 pointer-events-none absolute top-0 left-0 h-320 w-60 select-none rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
				<div className="-translate-y-87.5 -rotate-45 pointer-events-none absolute top-0 left-0 h-320 w-60 select-none bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
			</div>
			<div className="mx-auto flex max-w-xl flex-col items-center gap-6 sm:px-6 lg:px-8">
				<div className="flex items-center pt-8 sm:justify-start sm:pt-0">
					<div className="border-r px-4">{status}</div>

					<div className="ml-4 text-muted uppercase">{message}</div>
				</div>
				<div className="flex items-center gap-4">
					{canGoBack && (
						<Button onClick={() => router.history.back()}>
							<HugeiconsIcon icon={ArrowLeft02Icon} />
							<Trans>Go back</Trans>
						</Button>
					)}
					<Link to="/" className={buttonStyles({ intent: "outline" })}>
						<Trans>Home</Trans>
					</Link>
				</div>
			</div>
		</div>
	);
}
