import { useState } from "react";
import "../tools-common.css";

export default function Hasher(props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const hashInput = () => {
    setOutput(props.hashFunc(input));
  };

  const handleCopyClick = () => {
    try {
      navigator.clipboard.writeText(output);
      setTooltipVisible(true);

      setTimeout(() => {
        setTooltipVisible(false);
      }, 1450);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <section className="tool-section">
      <h3 className="tool-title">{props.title} Hasher</h3>
      <label htmlFor="input" className="field-label">
        Input:
      </label>
      <textarea
        id="input"
        className="field resize-vertical-only"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div className="action-button-group">
        <button
          onClick={hashInput}
          className="button primary-button action-button"
        >
          Hash
        </button>
      </div>
      <label htmlFor="output" className="field-label">
        Output:
      </label>
      <input
        id="output"
        className="field"
        value={output}
        readOnly
        onClick={handleCopyClick}
      ></input>
      {tooltipVisible && <span className="tooltip">Copied!</span>}
    </section>
  );
}
