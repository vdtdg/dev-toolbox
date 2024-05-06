import React from "react";
import "./jwt-helper.css";

const JwtHelper = () => {
	return (
		<section className="tool-section jwt-helper-wrapper">
			<h3>JWT Helper</h3>
			<p>JWT Helper content goes here</p>
			<div className="jwt-helper-algorithm-selector">
				<label>Algorithm</label>
				<select>
					<option value="HS256">HS256</option>
				</select>
			</div>
			<div className="jwt-container">
				<article className="jwt-helper-encoded">
					<h4>Encoded</h4>
					<div className="jwt-helper-encoded-content">
						<textarea></textarea>
					</div>
				</article>
				<article className="jwt-helper-decoded">
					<h4>Decoded</h4>
					<div className="jwt-helper-decoded-content">
						<div className="jwt-helper-decoded-header">
							<h5>HEADER</h5>
							<textarea></textarea>
						</div>
						<div className="jwt-helper-decoded-payload">
							<h5>PAYLOAD</h5>
							<textarea></textarea>
						</div>
						<div className="jwt-helper-decoded-verify-signature">
							<h5>VERIFY SIGNATURE</h5>
							<textarea></textarea>
						</div>
					</div>
				</article>
			</div>
			<div className="jwt-helper-footer">
				<p>Signature Verified</p>
				<button>SHARE JWT</button>
			</div>
		</section>
	);
};

export default JwtHelper;
