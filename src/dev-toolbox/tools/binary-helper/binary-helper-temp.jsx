import React, { useState, useEffect } from "react";
import "./binary-helper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

const BinaryHelper = () => {
	const [binaryGroups, setBinaryGroups] = useState([
		{
			value: 8,
			bits: Array(8).fill(0),
		},
	]);

	const addBinaryGroup = () => {
		const newGroup = {
			value: 8,
			bits: Array(8).fill(0), // Initialize with zeros for 8 bits
		};
		setBinaryGroups((prevGroups) => [...prevGroups, newGroup]);
	};

	const removeBinaryGroup = (index) => {
		setBinaryGroups((prevGroups) => prevGroups.filter((_, idx) => idx !== index));
	};

	const handleBitChange = (groupIndex, bitIndex, newValue) => {
		setBinaryGroups((prevGroups) =>
			prevGroups.map((group, idx) => {
				if (idx === groupIndex) {
					const newBits = [...group.bits];
					newBits[bitIndex] = newValue;
					return { ...group, bits: newBits };
				}
				return group;
			})
		);
	};

	const toggleNumBits = (index) => {
		setBinaryGroups((prevGroups) =>
			prevGroups.map((group, idx) => {
				if (idx === index) {
					const newBitCount = group.value === 8 ? 16 : 8;
					return { ...group, value: newBitCount, bits: Array(newBitCount).fill(0) };
				}
				return group;
			})
		);
	};

	return (
		<section className="crontab-wrapper tool-section">
			<h3>Binary Helper</h3>
			<p>This tool is used to convert binary numbers to decimal numbers and vice versa.</p>
			<div className="binary-helper-container">
				{binaryGroups.map((group, index) => (
					<div className="binary-helper-group" key={index}>
						<header>
							<p>Amount of bits to display:</p>
							<button onClick={() => toggleNumBits(index)} className="toggle-button">
								<FontAwesomeIcon icon={group.value === 8 ? faToggleOff : faToggleOn} />
								{group.value === 8 ? " 8 bits" : " 16 bits"}
							</button>
						</header>
						<section className="binary-group-section-1">
							<article className="binary-group-article-left">
								<p>Decimal Number:</p>
								<input type="number" min="0" max="65535" />
								<p>Mask</p>
								<p>Result</p>
							</article>
							{group.bits
								.slice()
								.reverse()
								.map((bit, bitIndex) => (
									<div className="binary-group-article-centre" key={bitIndex}>
										<p>
											2<sup>{group.value - 1 - bitIndex}</sup>
										</p>
										<input
											type="number"
											value={bit}
											onChange={(e) =>
												handleBitChange(index, group.value - 1 - bitIndex, parseInt(e.target.value))
											}
										/>
										<input
											type="number"
											value={bit}
											onChange={(e) =>
												handleBitChange(index, group.value - 1 - bitIndex, parseInt(e.target.value))
											}
										/>
										<input
											type="number"
											value={bit}
											onChange={(e) =>
												handleBitChange(index, group.value - 1 - bitIndex, parseInt(e.target.value))
											}
										/>
									</div>
								))}
						</section>
					</div>
				))}
				<div className="binary-button-group">
					<button onClick={addBinaryGroup} className="circle-button">
						<FontAwesomeIcon icon={faPlus} />
					</button>
					{binaryGroups.length > 1 && (
						<button
							onClick={() => removeBinaryGroup(binaryGroups.length - 1)}
							className="circle-button"
						>
							<FontAwesomeIcon icon={faMinus} />
						</button>
					)}
				</div>
			</div>
		</section>
	);
};

export default BinaryHelper;
