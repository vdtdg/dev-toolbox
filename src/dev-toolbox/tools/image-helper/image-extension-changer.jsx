import React from "react";
import { saveAs } from "file-saver";

function ExtensionChanger({ file }) {
	const handleChangeExtension = (newType) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			canvas.toBlob((blob) => {
				saveAs(blob, `converted.${newType}`);
			}, `image/${newType}`);
		};

		img.src = URL.createObjectURL(file);
	};

	return (
		<div>
			<button onClick={() => handleChangeExtension("png")}>Convert to PNG</button>
			<button onClick={() => handleChangeExtension("jpeg")}>Convert to JPEG</button>
			<button onClick={() => handleChangeExtension("webp")}>Convert to WEBP</button>
		</div>
	);
}

export default ExtensionChanger;
