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
		return binaryString.split("").map(Number).reverse();
	}

	const handleBitChange = (groupIndex, bitIndex) => {
		const newBinaryGroups = binaryGroups.map((group, index) => {
			if (index === groupIndex) {
				const newBits = [...group.bits];
				const correctIndex = group.numBits - 1 - bitIndex;
				newBits[correctIndex] = newBits[correctIndex] === 0 ? 1 : 0;
				const newDecimal = parseInt(newBits.slice().reverse().join(""), 2);
				return {
					...group,
					bits: newBits,
					decimal: newDecimal,
				};
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

	const handleMaskChange = (groupIndex, bitIndex, newBitValue) => {
		if (newBitValue > 1) {
			newBitValue = 0;
		} else if (newBitValue < 0) {
			newBitValue = 1;
		}

		const newBinaryGroups = binaryGroups.map((group, index) => {
			if (index === groupIndex) {
				const newMask = [...group.mask];
				const correctIndex = group.numBits - 1 - bitIndex;
				newMask[correctIndex] = newBitValue;
				const newResult = calculateResult(group.bits, newMask);
				return { ...group, mask: newMask, result: newResult };
			}
			return group;
		});
		setBinaryGroups(newBinaryGroups);
	};

	const calculateResult = (bits, mask) => {
		const resultBits = bits.map((bit, index) => bit & mask[index]); // Apply bitwise AND
		return parseInt(resultBits.reverse().join(""), 2);
	};

	return (
		<section className="crontab-wrapper tool-section">
			<h3>Binary Helper</h3>
			<p>
				This tool facilitates the conversion between binary and decimal numbers. Additionally, it
				computes the outcome of applying a mask to the binary representation, and shows the affect
				of bit shifting.
			</p>

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
								<div className="decimal-group-bits">
									{[...group.bits].reverse().map((bit, idx) => (
										<button
											onClick={() => handleBitChange(index, group.numBits - 1 - idx)}
											className="bit-button"
										>
											{bit}
										</button>
									))}
								</div>
								<div className="binary-group-mask">
									{group.mask.map((maskBit, idx) => (
										<button
											className="bit-button"
											onClick={() =>
												handleMaskChange(index, group.numBits - 1 - idx, maskBit === 0 ? 1 : 0)
											}
										>
											{maskBit}
										</button>
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
