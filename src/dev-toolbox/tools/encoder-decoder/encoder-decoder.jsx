import { useState } from "react";
import "./encoder-decoder.css";

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

  return (<>
    <h1 className="tool-title">{props.title} Decoder/Encoder</h1>
    <section className="tool-section">
      <div className="field-container">
        <div className="field-group">
          <label htmlFor="input" className="field-label">
            Input
          </label>
          <textarea 
            id="input"
            className="field-encoder-decoder"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="output" className="field-label">
            Output
          </label>
          <textarea 
            id="output"
            className="field-encoder-decoder"
            value={output}
            readOnly
            onClick={handleCopyClick}
          />
        </div>
      </div>
      <div className="button-group">
        <button onClick={encode} className="button primary-button">
          Encode
        </button>
        <button onClick={decode} className="button support-button">
          Decode
        </button>
      </div>
      {tooltipVisible && <div className="tooltip">Copied!</div>}
    </section>
    </>);
}
