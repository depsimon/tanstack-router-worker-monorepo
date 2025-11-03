import { msg } from "@lingui/core/macro";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SignUpForm } from "~/forms/sign-up";

export const Route = createFileRoute("/auth/register")({
	component: RouteComponent,
	head({ match }) {
		return {
			meta: [
				{
					title: match.context.i18n._(msg`Sign Up | ACME`),
				},
			],
		};
	},
});

function RouteComponent() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<SignUpForm />
			<div className="mt-2 text-sm">
				<Link to="/auth/login" className="hover:underline">
					Already have an account? Sign in
				</Link>
			</div>
		</div>
	);
}
