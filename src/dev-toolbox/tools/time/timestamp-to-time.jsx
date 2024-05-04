import { useState } from "react";
import "../tools-common.css";

export default function TimestampToTime() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const inputNow = () => {
    const now = new Date();
    setInput(now.getTime());
  };

  const timestampToTime = () => {
    const date = new Date(parseInt(input));
    setOutput(date.toISOString());
  };

  const timeToTimestamp = () => {
    const date = new Date(input);
    setOutput(date.getTime());
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
      <h3 className="tool-title">Timestamp to ISO Time</h3>
      <label htmlFor="input" className="field-label">
        Timestamp (in milliseconds) or ISO Time:
      </label>
      <input
        id="input"
        className="field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></input>
      <div className="action-button-group">
        <button
          onClick={timestampToTime}
          className="button primary-button action-button"
        >
          To ISO Time
        </button>
        <button
          onClick={timeToTimestamp}
          className="button secondary-button action-button"
        >
          To timestamp
        </button>
        <button
          onClick={inputNow}
          className="button support-button action-button"
        >
          Input now
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
      {tooltipVisible && <div className="tooltip">Copied!</div>}
    </section>
  );
}
