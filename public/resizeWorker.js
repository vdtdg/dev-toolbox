/* eslint-disable no-restricted-globals */
self.onmessage = async function (e) {
	const { imageData, width, height } = e.data;
	try {
		const response = await fetch(imageData);
		const blob = await response.blob();
		const bitmap = await createImageBitmap(blob);
		const canvas = new OffscreenCanvas(width, height);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(bitmap, 0, 0, width, height);
		const resizedBlob = await canvas.convertToBlob({ type: "image/png" });
		self.postMessage({ blob: resizedBlob });
	} catch (error) {
		console.error("Error processing image in worker:", error);
		self.postMessage({ error: error.message });
	}
};

/* eslint-enable no-restricted-globals */
