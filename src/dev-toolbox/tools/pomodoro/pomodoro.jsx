import React, { useEffect, useState } from "react";
import "../tools-common.css";

const modes = {
	session: "Working Time!",
	longBreak: "Long break.",
	shortBreak: "Short break.",
	notStarted: "Session not started yet.",
	paused: "Paused.",
};

const notes = [
	{ frequency: 659, duration: 400 },
	{ frequency: 0, duration: 200 },
	{ frequency: 659, duration: 400 },
	{ frequency: 0, duration: 200 },
	{ frequency: 659, duration: 400 },
];

export default function Pomodoro() {
	const [sessionCount, setSessionCount] = useState(4);
	const [sessionLength, setSessionLength] = useState(25);
	const [shortBreakLength, setShortBreakLength] = useState(5);
	const [longBreakLength, setLongBreakLength] = useState(15);
	const [currentTimer, setCurrentTimer] = useState(sessionLength * 60);
	const [isRunning, setIsRunning] = useState(false);
	const [currentSession, setCurrentSession] = useState(1);
	const [mode, setMode] = useState(modes.notStarted);

	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	function playNote({ frequency, duration }) {
		const oscillator = audioCtx.createOscillator();
		const gainNode = audioCtx.createGain();
		gainNode.gain.value = 0.03;
		oscillator.connect(gainNode);
		gainNode.connect(audioCtx.destination);
		oscillator.type = "triangle"; // can be sine, square, sawtooth, triangle
		oscillator.frequency.value = frequency;
		oscillator.start();
		setTimeout(() => oscillator.stop(), duration);
	}

	async function playMelody() {
		for (const note of notes) {
			playNote(note);
			await sleep(note.duration);
		}
	}

	function sleep(ms) {
		return new Promise((r) => setTimeout(r, ms));
	}

	function changeMode(mode) {
		setMode(mode);
		playMelody();
	}

	useEffect(() => {
		let interval;
		if (isRunning && mode !== modes.paused) {
			if (mode === modes.notStarted) setMode(modes.session);
			interval = setInterval(() => {
				setCurrentTimer((prev) => {
					if (prev <= 0) {
						switch (mode) {
							case modes.session:
								if (currentSession === sessionCount) {
									changeMode(modes.longBreak);
									return longBreakLength * 60;
								} else {
									changeMode(modes.shortBreak);
									return shortBreakLength * 60;
								}
							case modes.shortBreak:
								setCurrentSession((prev) => prev + 1);
								changeMode(modes.session);
								return sessionLength * 60;
							case modes.longBreak:
								setCurrentSession(1);
								changeMode(modes.session);
								return sessionLength * 60;
							default:
								return prev;
						}
					} else {
						return prev - 1;
					}
				});
			}, 1000);
		} else {
			clearInterval(interval); // Ensure to clear the interval when paused or stopped
		}

		return () => clearInterval(interval);
	}, [
		isRunning,
		mode,
		sessionCount,
		sessionLength,
		shortBreakLength,
		longBreakLength,
		currentSession,
	]);

	const togglePause = () => {
		if (mode === modes.paused) {
			setIsRunning(true);
			setMode((previousMode) => (previousMode === modes.paused ? modes.session : previousMode));
		} else {
			setIsRunning(false);
			setMode(modes.paused);
		}
	};

	const reset = () => {
		setIsRunning(false);
		setCurrentSession(1);
		setCurrentTimer(sessionLength * 60);
		setMode(modes.notStarted);
	};

	const updateFieldValue = (updateFieldFunction, defaultFieldValue, minFieldValue) => (e) => {
		const value = parseInt(e.target.value);
		if (isNaN(value) || value < minFieldValue) {
			updateFieldFunction(defaultFieldValue);
		} else {
			updateFieldFunction(value);
		}
	};

	return (
		<section className="tool-section">
			<h3 className="tool-title">Pomodoro</h3>
			<div className="centered-column-field-container">
				<label className="field-label">
					Number of work sessions between long breaks:
					<input
						className="field"
						type="number"
						min="1"
						value={sessionCount}
						onChange={updateFieldValue(setSessionCount, 4, 1)}
					/>
				</label>
				<label className="field-label">
					Session length (min):
					<input
						className="field"
						type="number"
						min="1"
						value={sessionLength}
						onChange={updateFieldValue(setSessionLength, 25, 1)}
					/>
				</label>
				<label className="field-label">
					Short break length (min):
					<input
						className="field"
						type="number"
						min="0"
						value={shortBreakLength}
						onChange={updateFieldValue(setShortBreakLength, 5, 0)}
					/>
				</label>
				<label className="field-label">
					Long break length (min):
					<input
						className="field"
						type="number"
						min="0"
						value={longBreakLength}
						onChange={updateFieldValue(setLongBreakLength, 15, 0)}
					/>
				</label>
			</div>
			<div className="action-button-group">
				{isRunning && mode !== modes.paused ? (
					<button className="button secondary-button action-button" onClick={togglePause}>
						Pause
					</button>
				) : null}

				{!isRunning && mode === modes.paused ? (
					<button className="button secondary-button action-button" onClick={togglePause}>
						Resume
					</button>
				) : null}

				{!isRunning && mode !== modes.paused ? (
					<button
						className="button primary-button action-button"
						onClick={() => {
							setIsRunning(true);
							if (mode === modes.notStarted || mode === modes.paused) {
								setMode(modes.session);
							}
						}}
					>
						Start
					</button>
				) : null}

				<button className="button secondary-button action-button" onClick={reset}>
					Reset
				</button>
			</div>
			<div className="mode-section">{mode}</div>
			<div className="timer-display">
				{Math.floor(currentTimer / 60)
					.toString()
					.padStart(2, "0")}{" "}
				: {(currentTimer % 60).toString().padStart(2, "0")}
			</div>
			<div className="bottom-warning">
				⚠️ Switching to another tool will reset your timer. If you want to use another tool, select
				it in the list and Right Click ➜ Open in another tab.
			</div>
		</section>
	);
}
