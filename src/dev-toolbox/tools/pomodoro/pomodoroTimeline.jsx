import React, { useEffect, useState } from "react";
import "./pomodoroTimeline.css";
import { usePomodoro } from "./pomodoroContext";

function PomodoroTimeline() {
  const [segments, setSegments] = useState([]);

  const {
    sessionCount,
    sessionLength,
    shortBreakLength,
    longBreakLength,
    currentSegment,
    currentTimer,
  } = usePomodoro();

  useEffect(() => {
    // Generate timeline segments based on the current configuration
    const newSegments = [];
    for (let i = 0; i < sessionCount; i++) {
      newSegments.push({ type: "session", length: sessionLength });
      if (i < sessionCount - 1) {
        newSegments.push({ type: "shortBreak", length: shortBreakLength });
      }
    }
    newSegments.push({ type: "longBreak", length: longBreakLength });
    setSegments(newSegments);
  }, [sessionCount, sessionLength, shortBreakLength, longBreakLength]);

  return (
    <div className="timeline-container">
      <div className="timeline">
        {segments.map((segment, index) => {
          return (
            <div
              key={`segfment-${index}`}
              className={
                index < currentSegment
                  ? "timeline-segment completed"
                  : `timeline-segment ${segment.type}`
              }
              style={{ flex: `${(segment.length * 100) / sessionLength}%` }}
              title={`${segment.type} - ${segment.length} minutes`}
            >
              {index === currentSegment && (
                <div
                  className="progress-indicator"
                  style={{
                    width: `${100 * (1 - currentTimer / (sessionLength * 60))}%`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PomodoroTimeline;
