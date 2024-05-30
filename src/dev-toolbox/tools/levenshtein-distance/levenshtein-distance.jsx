import React, { useState } from "react";
import "./levenshtein-distance.css";

function levenshteinDistance(firstWord, secondWord) {
  const firstWordLength = firstWord.length;
  const secondWordLength = secondWord.length;
  const scoreMatrix = Array(firstWordLength + 1)
    .fill(null)
    .map(() => Array(secondWordLength + 1).fill(null));

  for (let i = 0; i <= firstWordLength; i++) {
    for (let j = 0; j <= secondWordLength; j++) {
      if (i === 0) {
        scoreMatrix[i][j] = j;
      } else if (j === 0) {
        scoreMatrix[i][j] = i;
      } else if (firstWord[i - 1] === secondWord[j - 1]) {
        scoreMatrix[i][j] = scoreMatrix[i - 1][j - 1];
      } else {
        scoreMatrix[i][j] =
          1 +
          Math.min(
            scoreMatrix[i - 1][j],
            scoreMatrix[i][j - 1],
            scoreMatrix[i - 1][j - 1],
          );
      }
    }
  }
  return scoreMatrix[firstWordLength][secondWordLength];
}

export default function LevenshteinCalculator() {
  const [target, setTarget] = useState("");
  const [inputs, setInputs] = useState([""]);
  const [results, setResults] = useState([]);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const addNewInput = () => {
    setInputs([...inputs, ""]);
  };

  const calculateDistances = () => {
    const distances = inputs.map((input) => levenshteinDistance(target, input));
    setResults(distances);
  };

  return (
    <section className="tool-section">
      <h1 className="tool-title">Levenshtein Distance Calculator</h1>
      <table className="levenshtein-table">
        <thead className="levenshtein-table-head">
          <tr>
            <td className="column1">
              <label htmlFor="target">Target String:</label>
            </td>
            <td className="column2">
              <input
                id="target"
                className="field target-field"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </td>
            <td className="column3">Levenshtein Distance</td>
          </tr>
        </thead>
        <tbody>
          {inputs.map((input, index) => (
            <tr key={index}>
              <td className="column1">
                <label htmlFor={index.toString()}>Input {index + 1}:</label>
              </td>
              <td className="column2">
                <input
                  id={index.toString()}
                  className="field"
                  value={input}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </td>
              <td className="column3">
                {results[index] !== undefined && <span>{results[index]}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="button-group fixed-bottom">
        <button className="button support-button" onClick={addNewInput}>
          Add New Input
        </button>
        <button className="button primary-button" onClick={calculateDistances}>
          Calculate Distances
        </button>
      </div>
    </section>
  );
}
