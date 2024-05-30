import React, { useState } from "react";
import "./image-helper.css";
import ImageResizer from "./image-resizer";
import ExtensionChanger from "./image-extension-changer";

const ImageHelper = () => {
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateImageDetails = (newImage, newDimensions) => {
    setImage(newImage);
    setDimensions(newDimensions);
  };

  return (
    <section className="tool-section image-helper-wrapper">
      <h1 className="tool-title">Image Helper</h1>
      <p>
        This tool allows resizing of images as well as image type conversion.
      </p>
      <ImageResizer setImage={setImage} setDimensions={setDimensions} />
      <ExtensionChanger image={image} dimensions={dimensions} />
    </section>
  );
};

export default ImageHelper;
