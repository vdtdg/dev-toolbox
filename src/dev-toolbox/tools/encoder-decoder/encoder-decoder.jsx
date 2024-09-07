import React, { useEffect, useState } from "react";
import "./encoder-decoder.css";
import MonacoEditor from "@monaco-editor/react";
import { setEditorTheme } from "../../../dark-mode/monaco-theme";

export default function EncoderDecoder(props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem("selectedTheme"));

  document.addEventListener("themeChange", (event) => {
    setSelectedTheme(localStorage.getItem("selectedTheme"));
  });

  useEffect(() => {
    setOutput(props.encodeFunc(input));
  }, [input, props]);

  return (<>
    <h1 className="tool-title">{props.title} Decoder/Encoder</h1>
    <section className="tool-section">
      <div className="field-container">
        <div className="field-group">
          <div className="shadow-border-input">
            <label htmlFor="input" className="field-label">
              <span>Raw value</span>
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
        <output className="field-group">
          <div className="shadow-border-input">
            <label htmlFor="output" className="field-label">
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <span>Encoded value</span>
              </div>
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
        </output>
      </div>
    </section>
  </>);
}