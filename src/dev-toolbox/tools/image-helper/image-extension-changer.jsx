import React from "react";
import { saveAs } from "file-saver";

function ExtensionChanger({ image, dimensions }) {
	const handleChangeExtension = (newType) => {
		if (!image) {
			alert("No image loaded!");
			return;
		}

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		// Set the canvas size to the dimensions provided by ImageResizer
		canvas.width = dimensions.width;
		canvas.height = dimensions.height;

		img.onload = () => {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			canvas.toBlob((blob) => {
				saveAs(blob, `converted.${newType}`);
			}, `image/${newType}`);
		};

		img.src = URL.createObjectURL(image);
	};

	return (
		<div>
			{image && (
				<>
					<button
						className="button support-button action-button"
						onClick={() => handleChangeExtension("png")}
					>
						Convert to PNG
					</button>
					<button
						className="button support-button action-button"
						onClick={() => handleChangeExtension("jpeg")}
					>
						Convert to JPEG
					</button>
					<button
						className="button support-button action-button"
						onClick={() => handleChangeExtension("webp")}
					>
						Convert to WEBP
					</button>
				</>
			)}
		</div>
	);
}

export default ExtensionChanger;
