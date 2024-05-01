import React, { useState, useEffect } from "react";
import "./binary-helper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const BinaryHelper = () => {
	const [binaryGroups, setBinaryGroups] = useState([]);

	// on view load, add a binary group
	useEffect(() => {
		if (binaryGroups.length === 0) {
			addBinaryGroup();
		}
	}, []);

	const addBinaryGroup = () => {
		// Initialize new group with a default value of 8
		setBinaryGroups([...binaryGroups, { value: 8 }]);
	};

	const removeBinaryGroup = (index) => {
		const newBinaryGroups = [...binaryGroups];
		newBinaryGroups.splice(index, 1);
		setBinaryGroups(newBinaryGroups);
	};

	const handleChange = (index, newValue) => {
		// Toggle between 8 and 16 based on the current group's value
		const updatedGroups = binaryGroups.map((group, idx) => {
			if (idx === index) {
				return { ...group, value: group.value === 8 ? 16 : 8 };
			}
			return group;
		});
		setBinaryGroups(updatedGroups);
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
							<input
								type="number"
								value={group.value}
								onChange={() => handleChange(index, group.value)}
							/>
						</header>
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
