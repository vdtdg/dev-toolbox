import React from "react";
import "./image-helper.css";
import ImageResizer from "./image-resizer";
import ExtensionChanger from "./image-extension-changer";

const ImageHelper = () => {
	return (
		<section className="tool-section image-helper-wrapper">
			<h3>Image Helper</h3>
			<p>This tool allows resizing of images as well as image type conversion.</p>
			<ImageResizer />
			<ExtensionChanger />
		</section>
	);
};

export default ImageHelper;
