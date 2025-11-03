import { msg } from "@lingui/core/macro";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SignInForm } from "~/forms/sign-in";

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
	head({ match }) {
		return {
			meta: [
				{
					title: match.context.i18n._(msg`Sign In | ACME`),
				},
			],
		};
	},
});

function RouteComponent() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<SignInForm />
			<div className="mt-2 text-sm">
				<Link to="/auth/register" className="hover:underline">
					Don't have an account? Sign up
				</Link>
			</div>
		</div>
	);
}
