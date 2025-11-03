export async function uploadFile(
	key: string,
	file:
		| File
		| ArrayBuffer
		| Blob
		// biome-ignore lint/suspicious/noExplicitAny: any needed for ReadableStream
		| ReadableStream<any>
		| ArrayBufferView<ArrayBufferLike>,
	bucket: R2Bucket,
	options?: R2PutOptions,
) {
	return await bucket.put(key, file, options);
}

export function arrayBufferToReadableStream(
	arrayBuffer: ArrayBuffer,
): ReadableStream<Uint8Array> {
	return new ReadableStream<Uint8Array>({
		start(controller) {
			const chunkSize = 64 * 1024; // 64KB chunks (adjust as needed)
			let offset = 0;
			while (offset < arrayBuffer.byteLength) {
				const chunk = new Uint8Array(
					arrayBuffer,
					offset,
					Math.min(chunkSize, arrayBuffer.byteLength - offset),
				);
				controller.enqueue(chunk);
				offset += chunkSize;
			}
			controller.close();
		},
	});
}
