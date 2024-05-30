import { useState } from "react";
import "../tools-common.css";

export default function EncoderDecoder(props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const encode = () => {
    setOutput(props.encodeFunc(input));
  };

  const decode = () => {
    setOutput(props.decodeFunc(input));
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
      <h1 className="tool-title">{props.title} Decoder/Encoder</h1>
      <label htmlFor="input" className="field-label">
        Input:
      </label>
      <input
        id="input"
        className="field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></input>
      <div className="button-group">
        <button onClick={encode} className="button primary-button">
          Encode
        </button>
        <button onClick={decode} className="button support-button">
          Decode
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
