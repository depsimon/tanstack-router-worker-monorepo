import { Trans, useLingui } from "@lingui/react/macro";
import { type } from "arktype";
import { useAppForm } from "~/components/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { authClient, getAuthErrorMessage, useRefreshAuth } from "~/lib/auth";

export function SignInForm() {
	const { t } = useLingui();
	const { refresh } = useRefreshAuth();

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		canSubmitWhenInvalid: true,
		validators: {
			onSubmit: type({
				email: type("string.email").configure({
					message: t`Please enter a valid email address`,
				}),
				password: type("string > 7").configure({
					message: t`Password must be at least 8 characters long`,
				}),
			}),
			onSubmitAsync: async ({ value }) => {
				const { error } = await authClient.signIn.email({
					email: value.email,
					password: value.password,
				});

				if (error) {
					return getAuthErrorMessage(error.code) || "Unexpected error";
				}

				await refresh();
			},
		},
	});

	return (
		<form.AppForm>
			<Form
				className="w-full max-w-sm space-y-6"
				id={form.formId}
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<Card>
					<CardHeader>
						<CardTitle>
							<Trans>Sign in to your account</Trans>
						</CardTitle>
						<CardDescription>
							<Trans>Enter your credentials to access your account</Trans>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<form.AppField
							name="email"
							children={(field) => (
								<field.TextField aria-label={t`Enter your email address`}>
									<field.Label>
										<Trans>Email address</Trans>
									</field.Label>
									<field.Input type="email" />
									<field.FieldError />
								</field.TextField>
							)}
						/>
						<form.AppField
							name="password"
							children={(field) => (
								<field.TextField aria-label={t`Enter your password`}>
									<field.Label>
										<Trans>Password</Trans>
									</field.Label>
									<field.Input type="password" />
									<field.FieldError />
								</field.TextField>
							)}
						/>
						<form.ErrorMessages />
					</CardContent>
					<CardFooter>
						<form.Button>
							<Trans>Sign in</Trans>
						</form.Button>
					</CardFooter>
				</Card>
			</Form>
		</form.AppForm>
	);
}
