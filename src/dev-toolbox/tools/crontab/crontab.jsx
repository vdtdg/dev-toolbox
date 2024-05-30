import React, { useState } from "react";
import "./crontab.css";
import cronstrue from "cronstrue";
import cronParser from "cron-parser";
import { IoCopyOutline } from "react-icons/io5";

const daysLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CronTab = () => {
  const [minuteSelectionType, setMinuteSelectionType] = useState("any");
  const [specificMinute, setSpecificMinute] = useState(0);
  const [everyNMinutes, setEveryNMinutes] = useState(1);
  const [rangeMinuteFrom, setRangeMinuteFrom] = useState(0);
  const [rangeMinuteTo, setRangeMinuteTo] = useState(59);

  const [hourSelectionType, setHourSelectionType] = useState("any");
  const [specificHour, setSpecificHour] = useState(0);
  const [everyNHours, setEveryNHours] = useState(1);
  const [rangeHourFrom, setRangeHourFrom] = useState(0);
  const [rangeHourTo, setRangeHourTo] = useState(23);

  const [domSelectionType, setDomSelectionType] = useState("any");
  const [specificDay, setSpecificDay] = useState(1);
  const [everyNDays, setEveryNDays] = useState(1);
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(31);

  const [monthSelectionType, setMonthSelectionType] = useState("any");
  const [specificMonth, setSpecificMonth] = useState(1);
  const [everyNMonths, setEveryNMonths] = useState(1);
  const [rangeMonthFrom, setRangeMonthFrom] = useState(1);
  const [rangeMonthTo, setRangeMonthTo] = useState(12);

  const [dayOfWeek, setDayOfWeek] = useState(new Array(7).fill(false));
  const [anyDayOfWeek, setAnyDayOfWeek] = useState(true);

  // Handle changing selection type for minutes
  const handleMinuteTypeChange = (event) => {
    setMinuteSelectionType(event.target.value);
  };

  const handleHourTypeChange = (event) => {
    setHourSelectionType(event.target.value);
  };

  const handleMonthTypeChange = (event) => {
    setMonthSelectionType(event.target.value);
  };

  // Update handlers for day of month selection types
  const handleDomTypeChange = (event) => {
    setDomSelectionType(event.target.value);
  };

  const getMinuteValue = () => {
    switch (minuteSelectionType) {
      case "specific":
        return specificMinute.toString();
      case "every":
        return `*/${everyNMinutes}`;
      case "range":
        return `${rangeMinuteFrom}-${rangeMinuteTo}`;
      default:
        return "*";
    }
  };

  const getHourValue = () => {
    switch (hourSelectionType) {
      case "specific":
        return specificHour.toString();
      case "every":
        return `*/${everyNHours}`;
      case "range":
        return `${rangeHourFrom}-${rangeHourTo}`;
      default:
        return "*";
    }
  };

  const getMonthValue = () => {
    switch (monthSelectionType) {
      case "specific":
        return specificMonth.toString();
      case "every":
        return `*/${everyNMonths}`;
      case "range":
        return `${rangeMonthFrom}-${rangeMonthTo}`;
      default:
        return "*";
    }
  };

  const handlePreset = (preset) => {
    const allDays = new Array(7).fill(false);

    switch (preset) {
      case "hourly":
        setMinuteSelectionType("specific");
        setSpecificMinute(0);
        setHourSelectionType("any");
        setDomSelectionType("any");
        setMonthSelectionType("any");
        setDayOfWeek(allDays);
        setAnyDayOfWeek(true);
        break;
      case "daily":
        setMinuteSelectionType("specific");
        setSpecificMinute(0);
        setHourSelectionType("specific");
        setSpecificHour(0);
        setDomSelectionType("any");
        setMonthSelectionType("any");
        setDayOfWeek(allDays);
        setAnyDayOfWeek(true);
        break;
      case "weekly":
        setMinuteSelectionType("specific");
        setSpecificMinute(0);
        setHourSelectionType("specific");
        setSpecificHour(0);
        setDomSelectionType("any");
        setMonthSelectionType("any");
        allDays[1] = true;
        setDayOfWeek(allDays);
        setAnyDayOfWeek(false);
        break;
      case "businessHours":
        setMinuteSelectionType("every");
        setEveryNMinutes(20);
        setHourSelectionType("range");
        setRangeHourFrom(9);
        setRangeHourTo(16);
        setDomSelectionType("any");
        setMonthSelectionType("any");
        for (let i = 0; i <= 6; i++) {
          allDays[i] = i >= 1 && i <= 5;
        }
        setDayOfWeek(allDays);
        setAnyDayOfWeek(false);
        break;
      default:
        setMinuteSelectionType("any");
        setHourSelectionType("any");
        setDomSelectionType("any");
        setMonthSelectionType("any");
        setDayOfWeek(allDays);
        setAnyDayOfWeek(true);
        break;
    }
  };

  const handleDayOfWeekChange = (index) => {
    if (index === "any") {
      const updatedDays = new Array(7).fill(true);
      setDayOfWeek(updatedDays);
      setAnyDayOfWeek(!anyDayOfWeek);
      return;
    } else if (!anyDayOfWeek) {
      const updatedDays = [...dayOfWeek];
      updatedDays[index] = !updatedDays[index];
      setDayOfWeek(updatedDays);
    }
  };

  const getDayOfMonthValue = () => {
    switch (domSelectionType) {
      case "specific":
        return specificDay.toString();
      case "every":
        return `*/${everyNDays}`;
      case "range":
        return `${rangeFrom}-${rangeTo}`;
      case "any":
        return "*";
      default:
        return "*";
    }
  };

  const getDayOfWeekValue = () => {
    let daysOfWeek = dayOfWeek.every((val, i) => val)
      ? "*"
      : dayOfWeek
          .map((selected, idx) => (selected ? idx : null))
          .filter((n) => n !== null)
          .join(",");
    if (anyDayOfWeek) {
      daysOfWeek = "*";
    }
    return daysOfWeek;
  };

  const getCronExpression = () => {
    const minute = getMinuteValue();
    const hour = getHourValue();
    const dayOfMonth = getDayOfMonthValue();
    const month = getMonthValue();
    const dow = getDayOfWeekValue();
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dow}`;
  };

  const getHumanReadableDescription = () => {
    try {
      return cronstrue.toString(getCronExpression());
    } catch (e) {
      return "Invalid cron expression";
    }
  };

  const getNextRunTime = () => {
    try {
      const interval = cronParser.parseExpression(getCronExpression());
      return interval.next().toString();
    } catch (e) {
      return "Invalid cron expression";
    }
  };

  const handleMinuteSliderChange = (e) => {
    setEveryNMinutes(parseInt(e.target.value, 10));
    setMinuteSelectionType("every");
  };

  const handleHourSliderChange = (e) => {
    setEveryNHours(parseInt(e.target.value, 10));
    setHourSelectionType("every");
  };

  const handleDaySliderChange = (e) => {
    setEveryNDays(parseInt(e.target.value, 10));
    setDomSelectionType("every");
  };

  const handleMonthSliderChange = (e) => {
    setEveryNMonths(parseInt(e.target.value, 10));
    setMonthSelectionType("every");
  };

  const handleDomSliderChange = (e) => {
    setEveryNDays(parseInt(e.target.value, 10));
    setDomSelectionType("every");
  };

  return (
    <section className="crontab-wrapper tool-section">
      <h1 className="tool-title">Cron Tab Helper</h1>
      <p>
        This tool helps you create cron expressions for scheduling tasks. Fill
        out the fields or use the preset buttons below.
      </p>
      <div className="crontab-input-container">
        <div className="centered-column-field-container">
          <fieldset className="radio-selection">
            <legend className="field-label">Minute:</legend>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="any"
                  checked={minuteSelectionType === "any"}
                  onChange={handleMinuteTypeChange}
                />
                Any (*)
              </div>
            </label>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="specific"
                  checked={minuteSelectionType === "specific"}
                  onChange={handleMinuteTypeChange}
                />
                Specific Minute:
              </div>
              <input
                type="number"
                min="0"
                max="59"
                value={specificMinute}
                onChange={(e) =>
                  setSpecificMinute(parseInt(e.target.value, 10))
                }
              />
            </label>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="every"
                  checked={minuteSelectionType === "every"}
                  onChange={handleMinuteTypeChange}
                />
                Every
              </div>
              <input
                type="range"
                min="1"
                max="59"
                value={everyNMinutes}
                onChange={handleMinuteSliderChange}
              />
              {everyNMinutes} Minute(s)
            </label>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="range"
                  checked={minuteSelectionType === "range"}
                  onChange={handleMinuteTypeChange}
                />
                Range
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={rangeMinuteFrom}
                  onChange={(e) =>
                    setRangeMinuteFrom(parseInt(e.target.value, 10))
                  }
                />
                to
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={rangeMinuteTo}
                  onChange={(e) =>
                    setRangeMinuteTo(parseInt(e.target.value, 10))
                  }
                />
              </div>
            </label>
          </fieldset>

          <fieldset className="radio-selection">
            <legend className="field-label">Hour:</legend>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="any"
                  checked={hourSelectionType === "any"}
                  onChange={handleHourTypeChange}
                />
                Any (*)
              </div>
            </label>

            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="specific"
                  checked={hourSelectionType === "specific"}
                  onChange={handleHourTypeChange}
                />
                Specific Hour:
              </div>
              <input
                type="number"
                min="0"
                max="23"
                value={specificHour}
                onChange={(e) => setSpecificHour(parseInt(e.target.value, 10))}
              />
            </label>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="every"
                  checked={hourSelectionType === "every"}
                  onChange={handleHourTypeChange}
                />
                Every
              </div>
              <input
                type="range"
                min="1"
                max="23"
                value={everyNHours}
                onChange={handleHourSliderChange}
              />
              {everyNHours} Hour(s)
            </label>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="range"
                  checked={hourSelectionType === "range"}
                  onChange={handleHourTypeChange}
                />
                Range
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={rangeHourFrom}
                  onChange={(e) =>
                    setRangeHourFrom(parseInt(e.target.value, 10))
                  }
                />
                to
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={rangeHourTo}
                  onChange={(e) => setRangeHourTo(parseInt(e.target.value, 10))}
                />
              </div>
            </label>
          </fieldset>

          <fieldset className="radio-selection">
            <legend className="field-label">Day of Month:</legend>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="any"
                  checked={domSelectionType === "any"}
                  onChange={handleDomTypeChange}
                />
                Any (*)
              </div>
            </label>

            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="specific"
                  checked={domSelectionType === "specific"}
                  onChange={handleDomTypeChange}
                />
                Specific Day:
              </div>
              <input
                type="number"
                min="1"
                max="31"
                value={specificDay}
                onChange={(e) => setSpecificDay(parseInt(e.target.value, 10))}
              />
            </label>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="every"
                  checked={domSelectionType === "every"}
                  onChange={handleDomTypeChange}
                />
                Every
              </div>
              <input
                type="range"
                min="1"
                max="31"
                value={everyNDays}
                onChange={handleDomSliderChange}
              />
              {everyNDays} Day(s)
            </label>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="range"
                  checked={domSelectionType === "range"}
                  onChange={handleDomTypeChange}
                />
                Range
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(parseInt(e.target.value, 10))}
                />
                to
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={rangeTo}
                  onChange={(e) => setRangeTo(parseInt(e.target.value, 10))}
                />
              </div>
            </label>
          </fieldset>

          <fieldset className="radio-selection">
            <legend className="field-label">Month:</legend>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="any"
                  checked={monthSelectionType === "any"}
                  onChange={handleMonthTypeChange}
                />
                Any (*)
              </div>
            </label>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="specific"
                  checked={monthSelectionType === "specific"}
                  onChange={handleMonthTypeChange}
                />
                Specific Month:
              </div>
              <input
                type="number"
                min="1"
                max="12"
                value={specificMonth}
                onChange={(e) => setSpecificMonth(parseInt(e.target.value, 10))}
              />
            </label>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="every"
                  checked={monthSelectionType === "every"}
                  onChange={handleMonthTypeChange}
                />
                Every
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={everyNMonths}
                onChange={handleMonthSliderChange}
              />
              {everyNMonths} Month(s)
            </label>
            <label className="radio-selection-grouping">
              <div>
                <input
                  type="radio"
                  value="range"
                  checked={monthSelectionType === "range"}
                  onChange={handleMonthTypeChange}
                />
                Range
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={rangeMonthFrom}
                  onChange={(e) =>
                    setRangeMonthFrom(parseInt(e.target.value, 10))
                  }
                />
                to
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={rangeMonthTo}
                  onChange={(e) =>
                    setRangeMonthTo(parseInt(e.target.value, 10))
                  }
                />
              </div>
            </label>
          </fieldset>

          <fieldset className="radio-selection">
            <legend className="field-label">Day of Week:</legend>
            <div>
              <input
                type="checkbox"
                value="any"
                checked={anyDayOfWeek}
                onChange={() => handleDayOfWeekChange("any")}
              />
              Any (*)
            </div>
            <div className="checkbox-group">
              {daysLabels.map((label, idx) => (
                <label key={idx}>
                  <input
                    type="checkbox"
                    className="days-of-week-checkbox"
                    checked={dayOfWeek[idx]}
                    onChange={() => handleDayOfWeekChange(idx)}
                    disabled={anyDayOfWeek}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="button-group">
          <button className="field" onClick={() => handlePreset("hourly")}>
            Set Hourly
          </button>
          <button className="field" onClick={() => handlePreset("daily")}>
            Set Daily
          </button>
          <button className="field" onClick={() => handlePreset("weekly")}>
            Set Weekly
          </button>
          <button
            className="field"
            onClick={() => handlePreset("businessHours")}
          >
            Business Hours (Every 20 mins, 9am-5pm, Mon-Fri)
          </button>
        </div>
      </div>
      <div>
        <div className="centered-column-field-container">
          <label className="field-label margin-bottom">Cron Expression: </label>
          <div className="crontab-input-container">
            <div className="field cron-expression">
              <div>{getCronExpression()}</div>
              <button
                className="field copy-button"
                onClick={() =>
                  navigator.clipboard.writeText(getCronExpression())
                }
              >
                <IoCopyOutline />
              </button>
            </div>
          </div>
        </div>
        <div className="centered-column-field-container">
          <p>{getHumanReadableDescription()}</p>
        </div>
        <div className="centered-column-field-container">
          <label className="field-label margin-bottom">Next Run Time:</label>
          <p>{getNextRunTime()}</p>
        </div>
      </div>
    </section>
  );
};

export default CronTab;
