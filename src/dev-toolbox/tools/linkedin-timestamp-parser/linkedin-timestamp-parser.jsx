import { useState } from "react";
import "../tools-common.css";

export default function LinkedinTimestampParser() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const linkedinTimestampToTime = () => {
    const re = new RegExp("([0-9]{19})");
    const processedRegexp = re.exec(input);
    if (processedRegexp === null) {
      setOutput("Invalid post URL.");
      return;
    }
    const postId = processedRegexp.at(0);
    if (postId === undefined) {
      setOutput("Invalid post URL.");
      return;
    }

    const binaryPostId = parseInt(postId).toString(2);
    const timestampChars = binaryPostId.slice(0, 41);
    const timestamp = parseInt(timestampChars, 2);
    const utcDate = new Date(timestamp).toUTCString();

    setOutput(utcDate);
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
      <h3 className="tool-title">LinkedIn Post Date Parser</h3>
      <p>
        On LinkedIn, posts are displayed with time relative to the current day.
        This can lead to very vague dates: "1 year ago" can mean a huge range of
        dates. But did you know that the date of the post is hidden in the URL
        of the post itself?
      </p>
      <p>Thus, here is a tool to determine the exact LinkedIn post date.</p>
      <p>
        To find a post URL, click the three dots at the top right of a post, and
        click "Copy link to post". Then, just paste the URL in the box, and
        click Find Date.
      </p>
      <label htmlFor="input" className="field-label">
        LinkedIn Post URL
      </label>
      <input
        id="input"
        className="field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></input>
      <div className="action-button-group">
        <button
          onClick={linkedinTimestampToTime}
          className="button primary-button action-button"
        >
          Find Date
        </button>
      </div>
      <label htmlFor="output" className="field-label">
        Post date:
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
