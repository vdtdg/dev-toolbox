import React, { useState } from "react";
import { ChromePicker } from "react-color";
import "./color-picker.css";

function ColorPicker() {
	const initialColor = {
		hex: "#5e72e4", // Initial HEX color
		rgba: {
			r: 94,
			g: 114,
			b: 228,
			a: 1, // Initial RGBA values
		},
		hsl: {
			h: 231,
			s: 0.71,
			l: 0.63,
			a: 1, // Initial HSL values
		},
	};

	const [color, setColor] = useState(initialColor);
	const [copied, setCopied] = useState(""); // Tracks which button shows 'Copied!'

	const handleChangeComplete = (newColor) => {
		setColor({
			hex: newColor.hex,
			rgba: {
				r: newColor.rgb.r,
				g: newColor.rgb.g,
				b: newColor.rgb.b,
				a: newColor.rgb.a,
			},
			hsl: {
				h: newColor.hsl.h,
				s: newColor.hsl.s,
				l: newColor.hsl.l,
				a: newColor.hsl.a,
			},
		});
	};

	const copyToClipboard = (text, type) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setCopied(type); // Set which button shows 'Copied!'
				setTimeout(() => {
					setCopied(""); // Reset after 2000 milliseconds
				}, 2000);
			})
			.catch((err) => alert("Failed to copy text: ", err));
	};

	return (
		<section className="tool-section color-picker-wrapper">
			<h3 className="tool-title">Color Picker</h3>
			<p>
				This tool allows you to pick a color and get its HEX, RGBA, and HSLA values. You can also
				copy these values to your clipboard by clicking the buttons below for HEX, RGBA, and HSLA
				values.
			</p>
			<div className="color-picker-container">
				<ChromePicker
					color={color.rgba} // Use RGBA for the color input
					onChangeComplete={handleChangeComplete}
					disableAlpha={false}
				/>
				<div className="color-buttons">
					<p>
						HEX:{" "}
						<button
							className="button primary-button"
							onClick={() => copyToClipboard(color.hex, "hex")}
						>
							{copied === "hex" ? "Copied!" : color.hex}
						</button>
					</p>
					<p>
						RGBA:{" "}
						<button
							className="button primary-button"
							onClick={() =>
								copyToClipboard(
									`rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`,
									"rgba"
								)
							}
						>
							{copied === "rgba"
								? "Copied!"
								: `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`}
						</button>
					</p>
					<p>
						HSLA:{" "}
						<button
							className="button primary-button"
							onClick={() =>
								copyToClipboard(
									`hsla(${color.hsl.h.toFixed(0)}, ${(color.hsl.s * 100).toFixed(0)}%, ${(color.hsl.l * 100).toFixed(0)}%, ${color.hsl.a})`,
									"hsla"
								)
							}
						>
							{copied === "hsla"
								? "Copied!"
								: `hsla(${color.hsl.h.toFixed(0)}, ${(color.hsl.s * 100).toFixed(0)}%, ${(color.hsl.l * 100).toFixed(0)}%, ${color.hsl.a})`}
						</button>
					</p>
				</div>
			</div>
		</section>
	);
}

export default ColorPicker;
