import { Trans, useLingui } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";
import { type } from "arktype";
import { DropZone } from "react-aria-components";
import { useAppForm } from "~/components/form";
import { Form } from "~/components/ui/form";
import { useUpload } from "~/hooks/use-upload";
import { authClient, useAuthenticatedUser, useRefreshAuth } from "~/lib/auth";

export const Route = createFileRoute("/_app/settings/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { t } = useLingui();
	const { refresh } = useRefreshAuth();
	const { user } = useAuthenticatedUser();
	const { uploadImage } = useUpload();

	const form = useAppForm({
		defaultValues: {
			name: user.name,
			image: null as File | null,
		},
		canSubmitWhenInvalid: true,
		validators: {
			onSubmit: type({
				name: "string > 3",
				image: "File | null",
			}),
			onSubmitAsync: async ({ value }) => {
				let imageUrl: string | undefined;
				if (value.image) {
					imageUrl = await uploadImage({
						file: value.image,
						transform: {
							width: 256,
							height: 256,
							fit: "contain",
							gravity: "face",
						},
						output: {
							format: "image/avif",
						},
					});
				}

				await authClient.updateUser({
					name: value.name,
					image: imageUrl,
				});

				await refresh({ invalidateRouter: false });

				form.reset();
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
						name="image"
						children={(field) => {
							const previewImage = field.state.value
								? URL.createObjectURL(field.state.value)
								: user.image;

							return (
								<field.TextField aria-label={t`Enter your name`}>
									<field.Label>
										<Trans>Profile picture</Trans>
									</field.Label>
									<DropZone
										className="size-64"
										getDropOperation={(types) =>
											types.has("image/*") ? "copy" : "cancel"
										}
										onDrop={async (e) => {
											const files = e.items.filter(
												(item) => item.kind === "file",
											);
											if (files.length > 0) {
												field.handleChange(await files[0].getFile());
											}
										}}
									>
										{(dropZoneState) => (
											<field.Label className="group relative flex size-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl bg-accent-soft/30 shadow-mini-inset ring-1 ring-accent-soft transition-colors hover:bg-accent-soft/60">
												<p className="text-xs">
													<Trans>
														Drop an image or{" "}
														<button type="button">click to browse</button>
													</Trans>
												</p>
												<p className="text-muted text-xs">
													<Trans>PNG, JPG, GIF up to 2MB</Trans>
												</p>
												{previewImage && (
													<img
														src={previewImage}
														alt={t`Preview of profile picture`}
														className={`absolute inset-0 size-full object-cover transition-opacity ${
															dropZoneState.isHovered ||
															dropZoneState.isDropTarget
																? "opacity-0"
																: ""
														}`}
													/>
												)}
											</field.Label>
										)}
									</DropZone>
									<input
										type="file"
										className="hidden"
										accept="image/png, image/jpeg, image/gif, image/avif, image/webp"
										name={field.name}
										id={`${field.form.formId}-${field.name}`}
										onChange={(e) => {
											field.handleChange(e.currentTarget.files?.[0] ?? null);
										}}
									/>
									<field.FieldError />
								</field.TextField>
							);
						}}
					/>
					<form.AppField
						name="name"
						children={(field) => (
							<field.TextField aria-label={t`Enter your name`}>
								<field.Label>
									<Trans>Your name</Trans>
								</field.Label>
								<field.Input />
								<field.FieldError />
							</field.TextField>
						)}
					/>
					<form.Button>
						<Trans>Save</Trans>
					</form.Button>
					<form.ErrorMessages />
				</Form>
			</form.AppForm>
		</div>
	);
}
