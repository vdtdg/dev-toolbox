import React, { useState } from "react";
import "./binary-helper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

const BinaryHelper = () => {
	const [binaryGroups, setBinaryGroups] = useState([
		{
			numBits: 16,
			value: 0,
			bits: decimalToBinaryArray(0, 16),
			decimal: 0,
			mask: Array(16).fill(1),
			result: 0,
		},
	]);

	const addBinaryGroup = () => {
		const newGroup = {
			numBits: 16,
			value: 0,
			bits: decimalToBinaryArray(0, 16),
			decimal: 0,
			mask: Array(16).fill(1),
			result: 0,
		};
		setBinaryGroups((prevGroups) => [...prevGroups, newGroup]);
	};

	const removeBinaryGroup = (index) => {
		setBinaryGroups((prevGroups) => prevGroups.filter((_, idx) => idx !== index));
	};

	function decimalToBinaryArray(decimal, bits) {
		const binaryString = decimal.toString(2).padStart(bits, "0");
		return binaryString.split("").map(Number).reverse(); // Store bits in reverse order for easy handling
	}

	const handleBitChange = (groupIndex, bitIndex, newBitValue) => {
		const newBinaryGroups = binaryGroups.map((group, index) => {
			if (index === groupIndex) {
				const newBits = [...group.bits];
				newBits[bitIndex] = newBitValue;
				const newDecimal = parseInt(newBits.reverse().join(""), 2);
				newBits.reverse(); // Reverse back after converting to keep the original order
				return { ...group, bits: newBits, decimal: newDecimal };
			}
			return group;
		});
		setBinaryGroups(newBinaryGroups);
	};

	const handleDecimalChange = (groupIndex, newDecimalValue) => {
		const group = binaryGroups[groupIndex];
		const maxDecimalValue = Math.pow(2, group.numBits) - 1;

		if (newDecimalValue < 0)
			newDecimalValue = 0; // Prevent negative values
		else if (newDecimalValue > maxDecimalValue) newDecimalValue = maxDecimalValue; // Cap the value at the maximum

		const newBinaryGroups = binaryGroups.map((group, index) => {
			if (index === groupIndex) {
				return {
					...group,
					decimal: newDecimalValue,
					bits: decimalToBinaryArray(newDecimalValue, group.numBits),
				};
			}
			return group;
		});

		setBinaryGroups(newBinaryGroups);
	};

	const toggleNumBits = (index) => {
		const newBinaryGroups = binaryGroups.map((group, idx) => {
			if (idx === index) {
				const newNumBits = group.numBits === 8 ? 16 : 8;
				const maxDecimalValue = Math.pow(2, newNumBits) - 1;
				const newDecimal = group.decimal > maxDecimalValue ? maxDecimalValue : group.decimal;
				const newBits = decimalToBinaryArray(newDecimal, newNumBits);
				return {
					...group,
					numBits: newNumBits,
					decimal: newDecimal,
					bits: newBits,
					mask: Array(newNumBits).fill(1),
					result: 0,
				};
			}
			return group;
		});
		setBinaryGroups(newBinaryGroups);
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
								<FontAwesomeIcon icon={group.numBits === 8 ? faToggleOff : faToggleOn} />
								{group.numBits === 8 ? " 8 bits" : " 16 bits"}
							</button>
						</header>
						<article>
							<div className="binary-group-labels">
								<p>
									Decimal Number<sup></sup> {/* sup added for alignment */}
								</p>
								<input
									type="number"
									min="0"
									max={Math.pow(2, group.numBits) - 1}
									value={group.decimal}
									onChange={(e) => handleDecimalChange(index, parseInt(e.target.value))}
								/>
							</div>
							<div className="binary-group-row-labels">
								<p className="hidden">Powers</p>
								<p className="hidden">Bits</p>
								<p>Mask</p>
								<p>Result</p>
							</div>

							<div className="binary-group-main">
								<div className="binary-group-powers-of-two">
									{group.bits.map((_, idx) => (
										<p key={idx}>
											2<sup>{group.numBits - 1 - idx}</sup>
										</p>
									))}
								</div>
								<div className="decimal-group-container">
									{[...group.bits].reverse().map((bit, idx) => (
										<input
											key={idx}
											type="number"
											min="0"
											max="1"
											value={bit}
											onChange={(e) =>
												handleBitChange(index, group.numBits - 1 - idx, parseInt(e.target.value))
											}
											className="bit-input"
										/>
									))}
								</div>
							</div>
						</article>
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
