import React, { useState, useRef } from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import "./lorem-ipsum-generator.css";

function LoremIpsumGenerator() {
	const [numParagraphs, setNumParagraphs] = useState(3);
	const [avgSentencesPerParagraph, setAvgSentencesPerParagraph] = useState(4);
	const [startWithLorem, setStartWithLorem] = useState(true);
	const outputRef = useRef(null);
	const [buttonText, setButtonText] = useState("Copy");

	const handleCopy = () => {
		const text = Array.from(outputRef.current.querySelectorAll("p"))
			.map((p) => p.textContent)
			.join("\n\n");
		navigator.clipboard.writeText(text).then(
			() => {
				setButtonText("Copied!");
				setTimeout(() => {
					setButtonText("Copy");
				}, 2000); // Reset the button text after 2 seconds
			},
			(err) => {
				alert("Failed to copy text: ", err);
			}
		);
	};

	return (
		<section className="tool-section">
			<h3 className="tool-title">Lorem Ipsum Generator</h3>
			<p>
				This tool generates random text in the style of Lorem Ipsum. You can specify the number of
				paragraphs and the average number of sentences per paragraph.
			</p>
			<div className="lorem-ipsum-generator__options">
				<div>
					<label>Number of paragraphs:</label>
					<input
						type="number"
						value={numParagraphs}
						onChange={(e) => setNumParagraphs(parseInt(e.target.value, 10))}
						min="1"
					/>
				</div>
				<div>
					<label>Average sentences per paragraph:</label>
					<input
						type="number"
						value={avgSentencesPerParagraph}
						onChange={(e) => setAvgSentencesPerParagraph(parseInt(e.target.value, 10))}
						min="1"
					/>
				</div>
				<div>
					<label>Start with 'Lorem Ipsum':</label>
					<input
						type="checkbox"
						checked={startWithLorem}
						onChange={(e) => setStartWithLorem(e.target.checked)}
					/>
				</div>
				<button className="button support-button action-button" onClick={handleCopy}>
					{buttonText}
				</button>
			</div>

			<div ref={outputRef}>
				<LoremIpsum
					p={numParagraphs}
					avgSentencesPerParagraph={avgSentencesPerParagraph}
					startWithLoremIpsum={startWithLorem}
				/>
			</div>
		</section>
	);
}

export default LoremIpsumGenerator;
