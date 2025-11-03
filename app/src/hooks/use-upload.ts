import { useMutation } from "@tanstack/react-query";
import { orpc } from "~/lib/orpc";

export function useUpload() {
	const uploadImageMutation = useMutation(
		orpc.upload.uploadImage.mutationOptions(),
	);

	return {
		uploadImage: uploadImageMutation.mutateAsync,
	};
}
