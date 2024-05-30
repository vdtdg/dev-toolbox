import React, { useState, useEffect } from "react";
import "../tools-common.css";

const HttpRequest = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [jsonError, setJsonError] = useState(false);

  // Effect to clear the body and jsonError when method is GET
  useEffect(() => {
    if (method === "GET") {
      setBody("");
      setJsonError(false);
    }
  }, [method]);
  const parseHeaders = (headerString) => {
    const headerLines = headerString.split("\n");
    return headerLines.reduce((headers, line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex !== -1) {
        const key = line.substring(0, separatorIndex).trim();
        const value = line.substring(separatorIndex + 1).trim();
        if (key && value) {
          headers[key] = value;
        }
      }
      return headers;
    }, {});
  };
  const sendRequest = async () => {
    try {
      const headerObj = parseHeaders(headers);
      const parsedBody = method !== "GET" && body ? JSON.parse(body) : null;

      const res = await fetch(url, {
        method,
        headers: headerObj,
        body: parsedBody ? JSON.stringify(parsedBody) : null,
      });
      const data = await res.text();
      try {
        const jsonData = JSON.parse(data);
        setResponse(JSON.stringify(jsonData, null, 2));
      } catch (jsonParseError) {
        setResponse(data);
      }
      setJsonError(false);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setJsonError(true);
        setResponse("JSON Format Error: Please check your JSON syntax");
      } else {
        setResponse(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-section">
        <h1 className="tool-title">HTTP Request - Test your API</h1>
        <div className="centered-column-field-container">
          <input
            type="text"
            className="field"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <select
            className="field"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
          <textarea
            className="field resize-vertical-only"
            placeholder="Enter headers in format: Key: Value&#13;&#10;Content-Type: application/json&#13;&#10;Authorization: Bearer your_token_here&#13;&#10;"
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            rows={4}
          />
          <textarea
            className="field resize-vertical-only"
            placeholder="Enter request body as JSON"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            disabled={method === "GET"}
          />
          {jsonError && <p className="error-message">Invalid JSON format.</p>}
          <button
            className="button primary-button action-button"
            onClick={sendRequest}
          >
            Send Request
          </button>
        </div>
        <textarea
          className="field resize-vertical-only"
          placeholder="Response will appear here"
          value={response}
          readOnly
          rows={15}
        />
      </div>
    </div>
  );
};

export default HttpRequest;
