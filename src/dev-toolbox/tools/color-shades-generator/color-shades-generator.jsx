import React, { useState } from "react";
import "./color-shades-generator.css";

const ColorShadesGenerator = () => {
	const [baseColor, setBaseColor] = useState("#a84d4d");
	const [numShades, setNumShades] = useState(5);
	const [numTints, setNumTints] = useState(5);
	const [copiedText, setCopiedText] = useState({}); // This will track which color was copied

	// Function to generate shades and tints
	const generateColors = (baseColor, numShades, numTints) => {
		const shades = [];
		const tints = [];
		const shadeFactor = 0.8; // Darker by 20% per shade
		const tintFactor = 1.2; // Lighter by 20% per tint

		// Calculate shades (darker)
		for (let i = 0; i < numShades; i++) {
			const factor = Math.pow(shadeFactor, i + 1);
			const color = adjustBrightness(baseColor, factor);
			shades.push(color);
		}

		// Calculate tints (lighter)
		for (let i = 0; i < numTints; i++) {
			const factor = Math.pow(tintFactor, i + 1);
			const color = adjustBrightness(baseColor, factor);
			tints.push(color);
		}

		return { shades, tints };
	};

	// Function to adjust brightness based on factor
	const adjustBrightness = (hex, factor) => {
		let r = parseInt(hex.substr(1, 2), 16);
		let g = parseInt(hex.substr(3, 2), 16);
		let b = parseInt(hex.substr(5, 2), 16);

		r = Math.round(r * factor);
		g = Math.round(g * factor);
		b = Math.round(b * factor);

		r = Math.max(Math.min(255, r), 0);
		g = Math.max(Math.min(255, g), 0);
		b = Math.max(Math.min(255, b), 0);

		return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	};

	const copyToClipboard = async (color) => {
		await navigator.clipboard.writeText(color);
		setCopiedText({ [color]: true });

		setTimeout(() => {
			setCopiedText({ [color]: false }); // Clear after 2 seconds
		}, 2000);
	};

	const getInverseColor = (hex) => {
		let r = 255 - parseInt(hex.substr(1, 2), 16);
		let g = 255 - parseInt(hex.substr(3, 2), 16);
		let b = 255 - parseInt(hex.substr(5, 2), 16);

		return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	};

	const { shades, tints } = generateColors(baseColor, numShades, numTints);

	return (
		<section className="tool-section color-shades-wrapper">
			<h3 className="tool-title">Color Shades and Tints Generator</h3>
			<p>Generate shades and tints of a color based on the base color you select.</p>
			<div className="select-color-container">
				<label htmlFor="baseColor">
					Select Base Color:{" "}
					<input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} />
				</label>
				<label htmlFor="numShades">
					Number of Shades:{" "}
					<input
						type="number"
						value={numShades}
						min="1"
						max="10"
						onChange={(e) => setNumShades(parseInt(e.target.value))}
						placeholder="Number of Shades"
					/>
				</label>
				<label htmlFor="numTints">
					Number of Tints:{" "}
					<input
						type="number"
						value={numTints}
						min="1"
						max="10"
						onChange={(e) => setNumTints(parseInt(e.target.value))}
						placeholder="Number of Tints"
					/>
				</label>
			</div>
			<div>
				{shades.reverse().map((color, index) => (
					<div
						key={`shade-${index}`}
						style={{
							backgroundColor: color,
							color: getInverseColor(color),
							padding: "10px",
							marginBottom: "5px",
						}}
						onClick={() => copyToClipboard(color)}
					>
						{copiedText[color] ? "Copied!" : color}
					</div>
				))}
				<div
					style={{
						backgroundColor: baseColor,
						color: getInverseColor(baseColor),
						padding: "10px",
						marginBottom: "5px",
					}}
					onClick={() => copyToClipboard(baseColor)}
				>
					{copiedText[baseColor] ? "Copied!" : baseColor}
				</div>
				{tints.map((color, index) => (
					<div
						key={`tint-${index}`}
						style={{
							backgroundColor: color,
							color: getInverseColor(color),
							padding: "10px",
							marginBottom: "5px",
						}}
						onClick={() => copyToClipboard(color)}
					>
						{copiedText[color] ? "Copied!" : color}
					</div>
				))}
			</div>
		</section>
	);
};

export default ColorShadesGenerator;
