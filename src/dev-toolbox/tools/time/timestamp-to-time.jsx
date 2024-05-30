import React, { useEffect, useState } from "react";
import "../tools-common.css";
import { IoCopyOutline } from "react-icons/io5";

export default function TimestampToTime() {
  const [timestampMilli, setTimestampMilli] = useState(0);
  const [timestampSec, setTimestampSec] = useState(0);
  const [isoDate, setIsoDate] = useState(new Date().toISOString());

  useEffect(() => {
    console.log({ timestampMilli });
    updateDates(new Date(timestampMilli));
  }, [timestampMilli]);

  useEffect(() => {
    updateDates(new Date(timestampSec * 1000));
  }, [timestampSec]);

  useEffect(() => {
    updateDates(new Date(isoDate));
  }, [isoDate]);

  const updateDates = (date) => {
    if (!isNaN(date)) {
      setTimestampMilli(date.getTime());
      setTimestampSec(Math.floor(date.getTime() / 1000));
      setIsoDate(date.toISOString());
    }
  };

  const inputNow = () => {
    updateDates(new Date());
  };

  const handleCopyClick = (event, value) => {
    console.log({ event });
    try {
      navigator.clipboard.writeText(value);
      const $tooltip = document.querySelector(".tooltip");
      $tooltip.style.display = `block`;
      $tooltip.style.left = `${event.pageX}px`;
      $tooltip.style.top = `${event.pageY}px`;

      setTimeout(() => {
        $tooltip.style.display = `none`;
      }, 1450);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <section className="tool-section">
      <h1 className="tool-title">Timestamp to ISO Time</h1>

      <div className="tooltip" style={{ display: "none" }}>
        Copied!
      </div>

      <label htmlFor="timestampmilli" className="field-label">
        Timestamp (in milliseconds):
      </label>
      <div className="field-with-copy-container">
        <input
          id="timestampmilli"
          style={{ width: "220px" }}
          className="field"
          value={timestampMilli}
          onChange={(e) => setTimestampMilli(parseInt(e.target.value))}
        ></input>
        <button
          className="field copy-button"
          onClick={(event) => handleCopyClick(event, timestampMilli)}
        >
          <IoCopyOutline />
        </button>
      </div>

      <label htmlFor="timestamp" className="field-label">
        Timestamp (in seconds):
      </label>
      <div className="field-with-copy-container">
        <input
          id="timestamp"
          className="field"
          style={{ width: "220px" }}
          value={timestampSec}
          onChange={(e) => setTimestampSec(parseInt(e.target.value))}
        ></input>
        <button
          className="field copy-button"
          onClick={(event) => handleCopyClick(event, timestampSec)}
        >
          <IoCopyOutline />
        </button>
      </div>

      <label htmlFor="isodate" className="field-label">
        ISO Date:
      </label>
      <div className="field-with-copy-container">
        <input
          id="isodate"
          className="field"
          style={{ width: "220px" }}
          value={isoDate}
          onChange={(e) => setIsoDate(e.target.value)}
        ></input>
        <button
          className="field copy-button"
          onClick={(event) => handleCopyClick(event, isoDate)}
        >
          <IoCopyOutline />
        </button>
      </div>
      <div className="button-group">
        <button onClick={inputNow} className="button support-button">
          Input now
        </button>
      </div>
    </section>
  );
}
