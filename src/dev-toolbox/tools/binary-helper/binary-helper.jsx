import React, { useEffect, useState } from "react";
import "./binary-helper.css";
import { SlArrowLeft, SlArrowRight, SlMinus, SlPlus } from "react-icons/sl";

const BinaryHelper = () => {
  const breakWidth = 920;

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [binaryGroups, setBinaryGroups] = useState([
    {
      numBits: 16,
      value: 0,
      bits: decimalToBinaryArray(0, screenWidth < breakWidth ? 8 : 16),
      decimal: 0,
      mask: Array(16).fill(1),
      result: 0,
    },
  ]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);

      setBinaryGroups((groups) =>
        groups.map((group) => ({
          ...group,
          numBits: window.innerWidth < breakWidth ? 8 : 16,
          bits: decimalToBinaryArray(
            group.decimal,
            window.innerWidth < breakWidth ? 8 : 16,
          ),
          mask: Array(window.innerWidth < breakWidth ? 8 : 16).fill(1),
        })),
      );
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const addBinaryGroup = () => {
    const newGroup = {
      numBits: 16,
      value: 0,
      bits: decimalToBinaryArray(0, 16),
      decimal: 0,
      mask: Array(16).fill(1),
      result: 0,
    };
    setBinaryGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  const removeBinaryGroup = (index) => {
    setBinaryGroups((prevGroups) =>
      prevGroups.filter((_, idx) => idx !== index),
    );
  };

  function decimalToBinaryArray(decimal, bits) {
    const binaryString = decimal.toString(2).padStart(bits, "0");
    return binaryString.split("").map(Number);
  }

  const handleBitChange = (groupIndex, bitIndex) => {
    const newBinaryGroups = binaryGroups.map((group, index) => {
      if (index === groupIndex) {
        const newBits = [...group.bits];
        newBits[bitIndex] = newBits[bitIndex] === 0 ? 1 : 0; // Toggle the bit directly

        // Convert the array back to decimal after toggling the bit
        const newDecimal = parseInt(newBits.join(""), 2);
        const newResult = calculateResult(newBits, group.mask);
        return {
          ...group,
          bits: newBits,
          decimal: newDecimal,
          result: newResult,
        };
      }
      return group;
    });
    setBinaryGroups(newBinaryGroups);
  };

  const handleDecimalChange = (groupIndex, newDecimalValue) => {
    const group = binaryGroups[groupIndex];
    const maxDecimalValue = Math.pow(2, group.numBits) - 1;

    if (newDecimalValue < 0)
      newDecimalValue = 0; // Prevent negative values
    else if (newDecimalValue > maxDecimalValue)
      newDecimalValue = maxDecimalValue; // Cap the value at the maximum

    const newBinaryGroups = binaryGroups.map((group, index) => {
      if (index === groupIndex) {
        const newBits = decimalToBinaryArray(newDecimalValue, group.numBits);
        const newResult = calculateResult(newBits, group.mask);
        return {
          ...group,
          decimal: newDecimalValue,
          bits: decimalToBinaryArray(newDecimalValue, group.numBits),
          result: newResult,
        };
      }
      return group;
    });

    setBinaryGroups(newBinaryGroups);
  };

  const toggleNumBits = (index) => {
    const newBinaryGroups = binaryGroups.map((group, idx) => {
      if (idx === index) {
        const newNumBits = group.numBits === 8 ? 16 : 8; // Toggle between 8 and 16 bits
        return {
          numBits: newNumBits,
          value: 0, // Reset value
          bits: Array(newNumBits).fill(0), // Reset all bits to 0
          decimal: 0, // Reset decimal to 0
          mask: Array(newNumBits).fill(1), // Reset mask to all 1s
          result: 0, // Reset result to 0
        };
      }
      return group;
    });
    setBinaryGroups(newBinaryGroups);
  };

  const handleMaskChange = (groupIndex, bitIndex, newBitValue) => {
    if (newBitValue > 1) {
      newBitValue = 0;
    } else if (newBitValue < 0) {
      newBitValue = 1;
    }

    const newBinaryGroups = binaryGroups.map((group, index) => {
      if (index === groupIndex) {
        const newMask = [...group.mask];
        const correctIndex = group.numBits - 1 - bitIndex;
        newMask[correctIndex] = newBitValue;
        const newResult = calculateResult(group.bits, newMask);
        return { ...group, mask: newMask, result: newResult };
      }
      return group;
    });
    setBinaryGroups(newBinaryGroups);
  };

  const calculateResult = (bits, mask) => {
    const resultBits = bits.map((bit, index) => bit & mask[index]); // Apply bitwise AND
    return parseInt(resultBits.join(""), 2);
  };

  const handleBitShift = (groupIndex, direction) => {
    if (direction === "left") {
      // Shift all bits to the left
      const decimalValue = binaryGroups[groupIndex].decimal;
      const shiftedDecimal = decimalValue << 1;
      handleDecimalChange(groupIndex, shiftedDecimal);
    } else {
      // Shift all bits to the right
      const decimalValue = binaryGroups[groupIndex].decimal;
      const shiftedDecimal = decimalValue >> 1;
      handleDecimalChange(groupIndex, shiftedDecimal);
    }
  };

  return (
    <section className="crontab-wrapper tool-section">
      <h1 className="tool-title">Binary Helper</h1>
      <p>
        This tool facilitates the conversion between binary and decimal numbers.
        Additionally, it computes the outcome of applying a mask to the binary
        representation, and shows the affect of bit shifting.
      </p>

      <div className="binary-helper-container">
        {binaryGroups.map((group, index) => (
          <div className="binary-helper-group" key={index}>
            <header>
              <p>Amount of bits to display:</p>
              <button
                onClick={() => toggleNumBits(index)}
                className="button secondary-button"
              >
                {group.numBits === 8 ? " 16 bits" : " 8 bits"}
              </button>
            </header>
            <article>
              <div className="binary-group-labels">
                <p>
                  Decimal Number<sup></sup> {/* sup added for alignment */}
                </p>
                <input
                  type="number"
                  min="0"
                  max={Math.pow(2, group.numBits) - 1}
                  value={group.decimal}
                  onChange={(e) =>
                    handleDecimalChange(index, parseInt(e.target.value))
                  }
                />
              </div>
              <div className="binary-group-row-labels">
                <p className="hidden">Powers</p>
                <p className="hidden">Bits</p>
                <p>Mask</p>
                <p>Result</p>
              </div>
              <div className="binary-group-main">
                <div className="binary-group-powers-of-two">
                  {group.bits.map((_, idx) => (
                    <p key={idx}>
                      2<sup>{group.numBits - 1 - idx}</sup>
                    </p>
                  ))}
                </div>
                <div className="decimal-group-bits">
                  {group.bits.map((bit, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleBitChange(index, idx)} // idx corresponds directly to MSB to LSB
                      className="bit-button"
                    >
                      {bit}
                    </button>
                  ))}
                </div>
                <div className="binary-group-mask">
                  {group.mask.map((maskBit, idx) => (
                    <button
                      className="bit-button"
                      onClick={() =>
                        handleMaskChange(
                          index,
                          group.numBits - 1 - idx,
                          maskBit === 0 ? 1 : 0,
                        )
                      }
                    >
                      {maskBit}
                    </button>
                  ))}
                </div>
                <div className="binary-group-result">
                  {group.result
                    .toString(2)
                    .padStart(group.numBits, "0")
                    .split("")
                    .map((resultBit, idx) => (
                      <button key={idx} className="bit-button">
                        {resultBit}
                      </button>
                    ))}
                </div>
              </div>
              <div className="binary-group-right">
                <div className="shift-buttons">
                  <button onClick={(e) => handleBitShift(index, "left")}>
                    <SlArrowLeft />
                  </button>
                  <button onClick={(e) => handleBitShift(index, "right")}>
                    <SlArrowRight />
                  </button>
                  <p>Bit Shift</p>
                </div>
                <div className="result-decimal-display">
                  <div className="decimal-result">
                    <p>Decimal Result:</p>
                    <p>{group.result}</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        ))}

        <div className="binary-button-group">
          <button onClick={addBinaryGroup} className="circle-button">
            <SlPlus style={{ width: "100%", height: "100%" }} />
          </button>
          {binaryGroups.length > 1 && (
            <button
              onClick={() => removeBinaryGroup(binaryGroups.length - 1)}
              className="circle-button"
            >
              <SlMinus style={{ width: "100%", height: "100%" }} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default BinaryHelper;
