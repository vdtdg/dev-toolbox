import React, { useState } from "react";
import "./crontab.css";
import cronstrue from "cronstrue";
import { IoCopyOutline } from "react-icons/io5";

const CronTab = () => {
	const [minute, setMinute] = useState("*");
	const [hour, setHour] = useState("*");
	const [dayOfMonth, setDayOfMonth] = useState("*");
	const [month, setMonth] = useState("*");
	const [dayOfWeek, setDayOfWeek] = useState("*");

	const handlePreset = (preset) => {
		switch (preset) {
			case "hourly":
				setMinute("0");
				setHour("*");
				setDayOfMonth("*");
				setMonth("*");
				setDayOfWeek("*");
				break;
			case "daily":
				setMinute("0");
				setHour("0");
				setDayOfMonth("*");
				setMonth("*");
				setDayOfWeek("*");
				break;
			case "weekly":
				setMinute("0");
				setHour("0");
				setDayOfMonth("*");
				setMonth("*");
				setDayOfWeek("1"); // Monday
				break;
			case "businessHours":
				setMinute("*/20");
				setHour("9-17");
				setDayOfMonth("*");
				setMonth("*");
				setDayOfWeek("1-5"); // Monday to Friday
				break;
			default:
				setMinute("*");
				setHour("*");
				setDayOfMonth("*");
				setMonth("*");
				setDayOfWeek("*");
				break;
		}
	};

	const getCronExpression = () => {
		return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
	};

	const getHumanReadableDescription = () => {
		try {
			return cronstrue.toString(getCronExpression());
		} catch (e) {
			return "Invalid cron expression";
		}
	};

	return (
		<section className="tool-section">
			<h3 className="tool-title">Cron Tab Helper</h3>
			<p>
				This tool helps you create cron expressions for scheduling tasks. Fill out the fields or use
				the preset buttons below.
			</p>
			<div className="crontab-input-container">
				<div className="centered-column-field-container">
					<label className="field-label">
						Minute (0-59, * for every minute, */x for every x minutes):{" "}
					</label>
					<input className="field" value={minute} onChange={(e) => setMinute(e.target.value)} />

					<label className="field-label">Hour (0-23, * for every hour, range like 9-17): </label>
					<input className="field" value={hour} onChange={(e) => setHour(e.target.value)} />

					<label className="field-label">Day of Month (1-31, * for every day): </label>
					<input
						className="field"
						value={dayOfMonth}
						onChange={(e) => setDayOfMonth(e.target.value)}
					/>

					<label className="field-label">Month (1-12, * for every month): </label>
					<input className="field" value={month} onChange={(e) => setMonth(e.target.value)} />

					<label className="field-label">
						Day of Week (0-6, 0=Sunday, * for every day, range like 1-5):{" "}
					</label>
					<input
						className="field"
						value={dayOfWeek}
						onChange={(e) => setDayOfWeek(e.target.value)}
					/>
				</div>
				<div className="action-button-group">
					<button className="field" onClick={() => handlePreset("hourly")}>
						Set Hourly
					</button>
					<button className="field" onClick={() => handlePreset("daily")}>
						Set Daily
					</button>
					<button className="field" onClick={() => handlePreset("weekly")}>
						Set Weekly
					</button>
					<button className="field" onClick={() => handlePreset("businessHours")}>
						Business Hours (Every 20 mins, 9am-5pm, Mon-Fri)
					</button>
				</div>
			</div>
			<div className="centered-column-field-container">
				<label className="field-label margin-bottom">Cron Expression: </label>
				<div className="crontab-input-container">
					<input className="field" value={getCronExpression()} readOnly />
					<button
						className="field"
						onClick={() => navigator.clipboard.writeText(getCronExpression())}
					>
						<IoCopyOutline />
					</button>
				</div>
			</div>
			<div className="centered-column-field-container">
				<p>{getHumanReadableDescription()}</p>
			</div>
		</section>
	);
};

export default CronTab;
