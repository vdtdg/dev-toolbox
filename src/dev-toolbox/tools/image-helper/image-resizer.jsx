import React, { useState, useEffect } from "react";

function ImageResizer() {
	const [imageFile, setImageFile] = useState(null);
	const [originalUrl, setOriginalUrl] = useState("");
	const [previewUrl, setPreviewUrl] = useState("");
	const [width, setWidth] = useState(500);
	const [height, setHeight] = useState(500);
	const [originalDimensions, setOriginalDimensions] = useState({ width: 500, height: 500 });

	const [worker, setWorker] = useState(null);
	const [actionType, setActionType] = useState("preview");

	useEffect(() => {
		const newWorker = new Worker(`${process.env.PUBLIC_URL}/resizeWorker.js`);
		setWorker(newWorker);

		newWorker.onmessage = function (e) {
			if (e.data.blob) {
				const url = URL.createObjectURL(e.data.blob);
				if (actionType === "download") {
					const a = document.createElement("a");
					a.href = url;
					a.download = "resized-image.png";
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
					setActionType("preview");
				} else {
					setPreviewUrl(url);
				}
			} else {
				console.error(
					"An error occurred or the data returned from the worker is not a blob:",
					e.data.error
				);
			}
		};

		return () => newWorker.terminate(); // Cleanup worker
	}, [actionType]);

	useEffect(() => {
		if (originalUrl && worker) {
			worker.postMessage({ imageData: originalUrl, width, height });
		}
	}, [width, height, originalUrl, worker]); // Update preview when width, height, or originalUrl changes

	const handleImageUpload = async (event) => {
		const file = event.target.files[0];
		setImageFile(file);
		const fileUrl = URL.createObjectURL(file);
		setOriginalUrl(fileUrl);

		// Fetch dimensions without altering the canvas in the document
		const bitmap = await createImageBitmap(file);
		setWidth(bitmap.width);
		setHeight(bitmap.height);
		setOriginalDimensions({ width: bitmap.width, height: bitmap.height });

		// Directly use bitmap with worker if dimensions are valid
		if (bitmap.width > 0 && bitmap.height > 0 && worker) {
			worker.postMessage({ imageData: fileUrl, width: bitmap.width, height: bitmap.height });
		}
	};

	const handleExportImage = () => {
		if (!worker || width <= 0 || height <= 0) return;
		setActionType("download"); // Set the action type to download
		worker.postMessage({ imageData: originalUrl, width, height });
	};

	const handleRevert = () => {
		setWidth(originalDimensions.width);
		setHeight(originalDimensions.height);
		if (worker && originalDimensions.width > 0 && originalDimensions.height > 0) {
			worker.postMessage({
				imageData: originalUrl,
				width: originalDimensions.width,
				height: originalDimensions.height,
			});
		}
	};

	return (
		<div>
			<input type="file" accept="image/*" onChange={handleImageUpload} />
			{previewUrl && (
				<div className="image-resizer-container">
					<img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "500px" }} />

					<div className="image-controls-container">
						<label>
							Width:
							<input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
						</label>
						<label>
							Height:
							<input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
						</label>
						<button onClick={handleRevert}>Revert to Original</button>
					</div>
					<button onClick={handleExportImage}>Export Image</button>
				</div>
			)}
		</div>
	);
}

export default ImageResizer;
