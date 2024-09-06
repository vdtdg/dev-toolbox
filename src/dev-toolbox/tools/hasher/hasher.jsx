import { useState, useEffect } from "react";
import "./hasher.css";

export default function Hasher(props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    setOutput(props.hashFunc(input));
  }, [input, props]);

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

  return (<>
    <h1 className="tool-title">{props.title} Hasher</h1>
    <section className="tool-section">
      <div className="field-container">
        <div className="field-group">
          <label htmlFor="input" className="field-label">
            Input
          </label>
          <div className="shadow-border-input">
            <textarea
              id="input"
              className="field-encoder-decoder"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="output" className="field-label">
            Output
          </label>
          <div className="shadow-border-input">
            <textarea
              id="output"
              className="field-encoder-decoder"
              value={output}
              readOnly
              onClick={handleCopyClick}
            />
          </div>
        </div>
      </div>
      {tooltipVisible && <div className="tooltip">Copied!</div>}
    </section>
  </>);
}
