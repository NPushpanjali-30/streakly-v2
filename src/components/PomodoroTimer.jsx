import { useEffect, useRef, useState } from "react";
import "./PomodoroTimer.css";

const WORK = 25 * 60;
const BREAK = 5 * 60;

export default function PomodoroTimer({ habit, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(WORK);
  const [mode, setMode] = useState("work");
  const [running, setRunning] = useState(false);
  const [spentOnHabit, setSpentOnHabit] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            const nextMode = mode === "work" ? "break" : "work";
            setMode(nextMode);
            return nextMode === "work" ? WORK : BREAK;
          }
          if (mode === "work") setSpentOnHabit((m) => m + 1 / 60);
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const total = mode === "work" ? WORK : BREAK;
  const progress = 1 - secondsLeft / total;

  return (
    <div className="pomodoro-overlay" role="dialog" aria-label="Pomodoro timer">
      <div className="pomodoro-modal card">
        <button className="pomodoro-close" onClick={onClose} aria-label="Close timer">
          ×
        </button>
        <span className="eyebrow">{mode === "work" ? "Focus session" : "Break"}</span>
        <h3>{habit ? habit.name : "Free focus"}</h3>

        <div className="pomodoro-ring" style={{ "--progress": progress }}>
          <span className="pomodoro-time">
            {mins}:{secs}
          </span>
        </div>

        <div className="pomodoro-actions">
          <button className="btn btn-primary" onClick={() => setRunning((r) => !r)}>
            {running ? "Pause" : "Start"}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setRunning(false);
              setSecondsLeft(mode === "work" ? WORK : BREAK);
            }}
          >
            Reset
          </button>
        </div>

        <p className="pomodoro-spent">
          Focus time logged on this habit: <strong>{Math.round(spentOnHabit)} min</strong>
        </p>
      </div>
    </div>
  );
}
