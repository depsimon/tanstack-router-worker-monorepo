import { type } from "arktype";
import { authProcedure } from "~/worker/orpc/procedures";
import { arrayBufferToReadableStream } from "~/worker/services/upload";

export const upload = {
	uploadImage: authProcedure
		.input(
			type({
				file: "File",
				"output?": {
					format:
						"'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'image/avif' | 'rgb' | 'rgba'",
					"quality?": "number",
					"background?": "string",
					"anim?": "boolean",
				},
				"transform?": {
					"width?": "number",
					"height?": "number",
					"fit?":
						"'scale-down' | 'contain' | 'pad' | 'squeeze' | 'cover' | 'crop'",
					"gravity?":
						"'face' | 'left' | 'right' | 'top' | 'bottom' | 'center' | 'auto' | 'entropy'",
				},
			}),
		)
		.handler(async ({ input, context }) => {
			const fileBuffer = await input.file.arrayBuffer();

			const transformedImage = await context.env.IMAGES.input(
				arrayBufferToReadableStream(fileBuffer),
			)
				.transform(input.transform ?? {})
				.output(input.output ?? { format: "image/avif" });

			const fileName = `${Date.now()}.avif`;

			const object = await context.env.BUCKET.put(
				fileName,
				await transformedImage.response().arrayBuffer(),
				{
					httpMetadata: {
						contentType: transformedImage.contentType(),
					},
				},
			);

			return `${context.env.BUCKET_PUBLIC_URL}/${object.key}`;
		}),
};
