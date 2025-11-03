import { Trans } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAppForm } from "~/components/form";
import { Form } from "~/components/ui/form";
import {
	Modal,
	ModalBody,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "~/components/ui/modal";
import { Note } from "~/components/ui/note";

export const Route = createFileRoute("/_app/settings/advanced")({
	component: RouteComponent,
});

function RouteComponent() {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const form = useAppForm({
		canSubmitWhenInvalid: true,
		validators: {
			onSubmitAsync: async () => {
				setShowDeleteDialog(true);
			},
		},
	});

	return (
		<div>
			<form.AppForm>
				<Form
					className="max-w-md space-y-6"
					id={form.formId}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<div className="space-y-4 rounded-panel border px-4 py-3">
						<h2 className="font-semibold text-danger">
							<Trans>Danger Zone</Trans>
						</h2>
						<p className="text-muted text-sm">
							<Trans>
								Deleting your account is irreversible and will remove all your
								data.
							</Trans>
						</p>
						<form.Button intent="danger" isPending={false}>
							<Trans>Delete Account</Trans>
						</form.Button>
					</div>
				</Form>
			</form.AppForm>
			<Modal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<ModalContent>
					<ModalHeader>
						<ModalTitle>
							<Trans>Delete Account</Trans>
						</ModalTitle>
						<ModalDescription>
							<Trans>
								Are you sure you want to delete your account? This action cannot
								be undone.
							</Trans>
						</ModalDescription>
					</ModalHeader>
					<ModalBody>
						<Note intent="danger">
							<Trans>
								This will permanently delete your account and all associated
								data. If you are sure, please contact support to proceed with
								the deletion (support@acme.co).
							</Trans>
						</Note>
					</ModalBody>
					<ModalFooter>
						<ModalClose>Close</ModalClose>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
