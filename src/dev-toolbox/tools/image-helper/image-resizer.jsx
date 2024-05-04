import React, { useState, useEffect } from "react";

function ImageResizer() {
	const [imageFile, setImageFile] = useState(null);
	const [originalUrl, setOriginalUrl] = useState("");
	const [previewUrl, setPreviewUrl] = useState("");
	const [width, setWidth] = useState(500);
	const [height, setHeight] = useState(500);
	const [originalDimensions, setOriginalDimensions] = useState({ width: 500, height: 500 });

	useEffect(() => {
		if (originalUrl) {
			updatePreview();
		}
	}, [width, height]); // Update preview when width or height changes

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		setImageFile(file);
		const fileUrl = URL.createObjectURL(file);
		setOriginalUrl(fileUrl); // Save the original image URL
		setPreviewUrl(fileUrl); // Set preview to the original initially
		setInitialDimensions(file);
	};

	const setInitialDimensions = (file) => {
		const img = new Image();
		img.onload = () => {
			setWidth(img.width);
			setHeight(img.height);
			setOriginalDimensions({ width: img.width, height: img.height });
		};
		img.src = URL.createObjectURL(file);
	};

	const updatePreview = () => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		img.onload = () => {
			canvas.width = parseInt(width, 10);
			canvas.height = parseInt(height, 10);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			setPreviewUrl(canvas.toDataURL("image/png")); // Update preview URL with the resized image data
		};

		img.src = originalUrl; // Always use the original image for resizing
	};

	const handleExportImage = () => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		img.onload = () => {
			canvas.width = parseInt(width, 10);
			canvas.height = parseInt(height, 10);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			canvas.toBlob((blob) => {
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "resized-image.png";
				a.click();
			}, "image/png");
		};

		img.src = originalUrl; // Use the original image for export
	};

	const handleRevert = () => {
		setWidth(originalDimensions.width);
		setHeight(originalDimensions.height);
		updatePreview(); // Optionally update the preview immediately
	};

	return (
		<div>
			<input type="file" accept="image/*" onChange={handleImageUpload} />
			{previewUrl && (
				<img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "500px" }} />
			)}
			<div>
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
	);
}

export default ImageResizer;
