import React, { createContext, useContext, useState, useCallback } from "react";

const PomodoroContext = createContext();

export function usePomodoro() {
	return useContext(PomodoroContext);
}

export const PomodoroProvider = ({ children }) => {
	const [sessionCount, setSessionCount] = useState(4);
	const [sessionLength, setSessionLength] = useState(25);
	const [shortBreakLength, setShortBreakLength] = useState(5);
	const [longBreakLength, setLongBreakLength] = useState(15);
	const [currentTimer, setCurrentTimer] = useState(sessionLength * 60);
	const [isRunning, setIsRunning] = useState(false);
	const [currentSession, setCurrentSession] = useState(1);
	const [mode, setMode] = useState("notStarted");
	const [volume, setVolume] = useState(0.5);
	const value = {
		sessionCount,
		setSessionCount,
		sessionLength,
		setSessionLength,
		shortBreakLength,
		setShortBreakLength,
		longBreakLength,
		setLongBreakLength,
		currentTimer,
		setCurrentTimer,
		isRunning,
		setIsRunning,
		currentSession,
		setCurrentSession,
		mode,
		setMode,
		volume,
		setVolume,
	};

	return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
};
