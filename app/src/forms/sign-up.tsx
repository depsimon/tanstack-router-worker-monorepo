import { Trans, useLingui } from "@lingui/react/macro";
import { useQueryClient } from "@tanstack/react-query";
import { redirect, useRouter } from "@tanstack/react-router";
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
import { authClient, getAuthErrorMessage } from "~/lib/auth";
import { authSessionQuery } from "~/requests/auth";

export function SignUpForm() {
	const { t } = useLingui();
	const router = useRouter();
	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: {
			name: "",
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
				const { error } = await authClient.signUp.email({
					name: value.name,
					email: value.email,
					password: value.password,
				});

				if (error?.code) {
					const errorMessage =
						getAuthErrorMessage(error.code) || "Unexpected error";

					if (
						["PASSWORD_TOO_SHORT", "PASSWORD_TOO_LONG"].includes(error.code)
					) {
						return {
							fields: {
								password: errorMessage,
							},
						};
					}

					return errorMessage;
				}

				await queryClient.invalidateQueries(authSessionQuery());
				await router.invalidate();

				await redirect({ to: "/" });
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
							<Trans>Sign up for an account</Trans>
						</CardTitle>
						<CardDescription>
							<Trans>Enter your details to create a new account</Trans>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<form.AppField
							name="name"
							children={(field) => (
								<field.TextField aria-label={t`Enter your name`}>
									<field.Label>
										<Trans>Name</Trans>
									</field.Label>
									<field.Input />
									<field.FieldError />
								</field.TextField>
							)}
						/>
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
