import { useEffect, useRef, useState } from "react";
import {
  isCheckedToday,
  currentStreak,
  longestStreak,
} from "../utils/habits";
import "./HabitCard.css";

export default function HabitCard({ habit, onToggle, onStartPomodoro }) {
  const checked = isCheckedToday(habit);
  const [justChecked, setJustChecked] = useState(false);
  const [streakBounce, setStreakBounce] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const streak = currentStreak(habit);
  const prevStreak = useRef(streak);

  useEffect(() => {
    if (streak > prevStreak.current) {
      setStreakBounce(true);
      const t = setTimeout(() => setStreakBounce(false), 500);
      prevStreak.current = streak;
      return () => clearTimeout(t);
    }
    prevStreak.current = streak;
  }, [streak]);

  const handleToggle = () => {
    if (!checked) {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 600);
    }
    onToggle(habit);
  };

  return (
    <div
      className={"habit-card" + (justChecked ? " just-checked" : "")}
      style={{ "--habit-color": habit.color }}
    >
      <div className="habit-card-top">
        <span className="habit-card-tag">
          <span className="habit-card-dot" /> {habit.category}
        </span>
        <button
          className={"habit-checkbox" + (checked ? " checked" : "")}
          onClick={handleToggle}
          aria-pressed={checked}
          aria-label={checked ? "Mark not done" : "Mark done today"}
        >
          {checked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      <h3 className="habit-card-name">{habit.name}</h3>

      {habit.notes && (
        <button
          className="notes-toggle"
          onClick={() => setNotesOpen((o) => !o)}
          aria-expanded={notesOpen}
        >
          {notesOpen ? "▲ Hide note" : "▼ Why this matters"}
        </button>
      )}
      {habit.notes && notesOpen && (
        <p className="habit-card-notes">{habit.notes}</p>
      )}

      {streak === 0 && !checked && (
        <p className="streak-nudge">✨ Start your streak today!</p>
      )}

      <div className="habit-card-streaks">
        <div className="streak-pill">
          <span className={"streak-num" + (streakBounce ? " bounce" : "")}>
            {streak}
          </span>
          <span className="streak-label">current</span>
        </div>
        <div className="streak-pill">
          <span className="streak-num">{longestStreak(habit)}</span>
          <span className="streak-label">longest</span>
        </div>
      </div>

      <StreakBadges streak={streak} />

      <button className="pomodoro-link" onClick={() => onStartPomodoro(habit)}>
        ⏱ Focus on this
      </button>
    </div>
  );
}

function StreakBadges({ streak }) {
  const badges = [];
  if (streak >= 3) badges.push({ label: "3-day streak", icon: "🔥" });
  if (streak >= 7) badges.push({ label: "7-day consistency", icon: "🧠" });
  if (streak >= 30) badges.push({ label: "30-day mastery", icon: "👑" });
  if (badges.length === 0) return null;
  return (
    <div className="habit-badges">
      {badges.map((b) => (
        <span key={b.label} className="habit-badge">
          {b.icon} {b.label}
        </span>
      ))}
    </div>
  );
}
