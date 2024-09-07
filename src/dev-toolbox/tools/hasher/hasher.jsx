import React, { useEffect, useState } from "react";
import "./hasher.css";
import MonacoEditor from "@monaco-editor/react";
import { setEditorTheme } from "../../../dark-mode/monaco-theme";

export default function Hasher(props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem("selectedTheme"));

  useEffect(() => {
    if (input === "") {
      setOutput("");
    } else {
      setOutput(props.hashFunc(input).toString());
    }
  }, [input, props]);

  return (<>
    <h1 className="tool-title">{props.title} Hasher</h1>
    <section className="tool-section">
      <div className="field-container">
        <div className="field-group">
          <div className="shadow-border-input">
            <label htmlFor="input" className="field-label">
              Input
            </label>
            <MonacoEditor
              height="72vh"
              language="text"
              theme={selectedTheme === "dark" ? "custom-dark" : "custom-light"}
              options={{
                lineNumbers: "off",
                minimap: { enabled: false },
                overviewRulerBorder: false,
                automaticLayout: true,
                scrollbar: {
                  useShadows: false,
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8
                },
                renderLineHighlight: "none",
                wordWrap: "on"
              }}
              value={input}
              onChange={(value) => setInput(value)}
              beforeMount={setEditorTheme}
            />
          </div>
        </div>
        <div className="field-group">
          <div className="shadow-border-input">
            <label htmlFor="output" className="field-label">
              Hashed value
            </label>
            <MonacoEditor
              height="72vh"
              language="text"
              theme={selectedTheme === "dark" ? "custom-dark" : "custom-light"}
              options={{
                lineNumbers: "off",
                minimap: { enabled: false },
                overviewRulerBorder: false,
                automaticLayout: true,
                scrollbar: {
                  useShadows: false,
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8
                },
                renderLineHighlight: "none",
                wordWrap: "on"
              }}
              value={output}
              beforeMount={setEditorTheme}
            />
          </div>
        </div>
      </div>
    </section>
  </>);
}
