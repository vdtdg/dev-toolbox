import React, { useState } from "react";
import DiffViewer from "react-diff-viewer";
import "./file-diff.css";
import "../tools-common.css";

const FileDiff = () => {
	const [file1Content, setFile1Content] = useState("");
	const [file2Content, setFile2Content] = useState("");
	const [file1, setFile1] = useState(null);
	const [file2, setFile2] = useState(null);

	const handleFileChange = (file, setter) => {
		if (file === null) {
			return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			setter(e.target.result);
		};
		reader.readAsText(file);
	};

	const handleFile1Change = (event) => {
		const file = event.target.files[0];
		setFile1(file);
		handleFileChange(file, setFile1Content);
	};

	const handleFile2Change = (event) => {
		const file = event.target.files[0];
		setFile2(file);
		handleFileChange(file, setFile2Content);
	};

	return (
		<section className="tool-section file-diff-wrapper">
			<h3>File Diff</h3>
			<p>This tool helps compare the difference between two files.</p>
			<div className="file-upload-buttons">
				<input
					type="file"
					accept=".txt,.js,.py,.java,.json,.xml,.yaml,.html,.md"
					onChange={handleFile1Change}
				/>
				<input
					type="file"
					accept=".txt,.js,.py,.java,.json,.xml,.yaml,.html,.md"
					onChange={handleFile2Change}
				/>
			</div>

			{file1Content && file2Content && (
				<div className="diffviewer-container">
					<DiffViewer
						oldValue={file1Content}
						newValue={file2Content}
						splitView={false}
						showDiffOnly={false}
					/>
				</div>
			)}
		</section>
	);
};

export default FileDiff;
