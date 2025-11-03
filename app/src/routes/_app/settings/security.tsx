import { Trans, useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "~/components/form";
import { Form } from "~/components/ui/form";
import { Note } from "~/components/ui/note";
import { authClient, getAuthErrorMessage, useRefreshAuth } from "~/lib/auth";

export const Route = createFileRoute("/_app/settings/security")({
	component: RouteComponent,
});

function RouteComponent() {
	const { t } = useLingui();
	const { refresh } = useRefreshAuth();

	const form = useAppForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
		},
		canSubmitWhenInvalid: true,
		validators: {
			onSubmitAsync: async ({ value }) => {
				const { error } = await authClient.changePassword({
					currentPassword: value.currentPassword,
					newPassword: value.newPassword,
					revokeOtherSessions: true,
				});

				if (error?.code) {
					const errorMessage =
						getAuthErrorMessage(error.code) || "Unexpected error";

					if (["INVALID_PASSWORD"].includes(error.code)) {
						return {
							fields: {
								currentPassword: errorMessage,
							},
						};
					}
					if (
						["PASSWORD_TOO_SHORT", "PASSWORD_TOO_LONG"].includes(error.code)
					) {
						return {
							fields: {
								newPassword: errorMessage,
							},
						};
					}

					return errorMessage;
				}

				form.reset();
				await refresh();
			},
		},
	});

	return (
		<div>
			<form.AppForm>
				<Form
					className="w-full max-w-xs space-y-6"
					id={form.formId}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<form.AppField
						name="currentPassword"
						children={(field) => (
							<field.TextField aria-label={t`Enter your current password`}>
								<field.Label>
									<Trans>Current password</Trans>
								</field.Label>
								<field.Input type="password" />
								<field.FieldError />
							</field.TextField>
						)}
					/>
					<form.AppField
						name="newPassword"
						children={(field) => (
							<field.TextField aria-label={t`Enter your new password`}>
								<field.Label>
									<Trans>New password</Trans>
								</field.Label>
								<field.Input type="password" />
								<field.FieldError />
							</field.TextField>
						)}
					/>
					<Note intent="warning">
						<Trans>This will log you out of all devices.</Trans>
					</Note>
					<form.Button>
						<Trans>Change Password</Trans>
					</form.Button>
					<form.ErrorMessages />
				</Form>
			</form.AppForm>
		</div>
	);
}
