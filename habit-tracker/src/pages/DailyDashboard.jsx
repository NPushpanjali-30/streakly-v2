import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useHabits } from "../utils/useHabits";
import {
  toggleCheckin,
  isCheckedToday,
  useFreeze,
  isCheckedOn,
  daysAgoStr,
  isDueToday,
  weekCheckins,
  togglePin,
  sortHabits,
} from "../utils/habits";
import HabitCard from "../components/HabitCard";
import HabitCardSkeleton from "../components/HabitCardSkeleton";
import ProgressBar from "../components/ProgressBar";
import PomodoroTimer from "../components/PomodoroTimer";
import { showToast } from "../components/Toast";
import "./DailyDashboard.css";

export default function DailyDashboard() {
  const { habits, loading, replaceHabit } = useHabits();
  const [pomodoroHabit, setPomodoroHabit] = useState(null);
  const [showPomodoro, setShowPomodoro] = useState(false);

  const doneToday = useMemo(
    () => habits.filter((h) => isCheckedToday(h)).length,
    [habits]
  );

  const [showAllDone, setShowAllDone] = useState(false);
  const prevDone = useRef(doneToday);

  useEffect(() => {
    if (
      habits.length > 0 &&
      doneToday === habits.length &&
      prevDone.current !== habits.length
    ) {
      setShowAllDone(true);
      const t = setTimeout(() => setShowAllDone(false), 4000);
      return () => clearTimeout(t);
    }
    prevDone.current = doneToday;
  }, [doneToday, habits.length]);

  const weeklySummary = useMemo(() => {
    if (habits.length === 0) return null;
    let done = 0;
    const possible = habits.length * 7;
    for (let i = 0; i < 7; i++) {
      const d = daysAgoStr(i);
      habits.forEach((h) => {
        if (isCheckedOn(h, d)) done++;
      });
    }
    return { done, possible };
  }, [habits]);

  const handleToggle = (habit) => {
    const wasChecked = isCheckedToday(habit);
    replaceHabit(toggleCheckin(habit));
    if (!wasChecked) {
      showToast(`✓ "${habit.name}" checked in!`, "success");
    }
  };

  const handlePin = (habit) => {
    replaceHabit(togglePin(habit));
  };

  const handleFreeze = (habit) => {
    replaceHabit(useFreeze(habit));
    showToast(`🧊 Freeze token used for "${habit.name}" — yesterday protected.`, "info");
  };

  return (
    <div className="page daily-dashboard-page">
      <span className="eyebrow">Today</span>
      <h1>Your daily check-in</h1>

      {loading ? (
        <div className="habit-grid">
          {[1, 2, 3].map((n) => (
            <HabitCardSkeleton key={n} />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <div className="card empty-state">
          <p>You haven't created any habits yet.</p>
          <Link to="/habits/new" className="btn btn-primary">
            Add your first habit
          </Link>
        </div>
      ) : (
        <>
          <ProgressBar done={doneToday} total={habits.length} />

          {showAllDone && (
            <div className="all-done-banner" role="status" aria-live="polite">
              <span className="all-done-emoji">🎉</span>
              <div>
                <strong>All done today!</strong>
                <p>Every habit checked in — that's a perfect day.</p>
              </div>
            </div>
          )}

          {weeklySummary && (
            <p className="weekly-summary">
              You completed{" "}
              <strong>
                {weeklySummary.done}/{weeklySummary.possible}
              </strong>{" "}
              possible check-ins this week
              {weeklySummary.done === weeklySummary.possible
                ? " — perfect week! 🎉"
                : weeklySummary.done >= weeklySummary.possible * 0.8
                ? " — great consistency! 🔥"
                : "."}
            </p>
          )}

          <div className="habit-grid">
            {sortHabits(habits).map((h) => (
              <div key={h.id} className="habit-grid-item">
                {h.frequency !== "Daily" && (
                  <div className="freq-badge">
                    {isDueToday(h) ? (
                      <span className="freq-due">Due this week</span>
                    ) : (
                      <span className="freq-done">
                        ✓ {weekCheckins(h)}× this week
                      </span>
                    )}
                  </div>
                )}
                <HabitCard
                  habit={h}
                  onToggle={handleToggle}
                  onStartPomodoro={(habit) => {
                    setPomodoroHabit(habit);
                    setShowPomodoro(true);
                  }}
                />
                {!h.freeze?.used && (
                  <button
                    className="freeze-btn"
                    onClick={() => handleFreeze(h)}
                    title="Spend your weekly freeze token to protect yesterday's streak"
                  >
                    🧊 Use freeze token
                  </button>
                )}
                <button
                  className={"pin-btn" + (h.pinned ? " pinned" : "")}
                  onClick={() => handlePin(h)}
                  title={h.pinned ? "Unpin habit" : "Pin to top"}
                  aria-pressed={!!h.pinned}
                >
                  {h.pinned ? "📌 Pinned" : "📌 Pin to top"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {showPomodoro && (
        <PomodoroTimer
          habit={pomodoroHabit}
          onClose={() => setShowPomodoro(false)}
        />
      )}
    </div>
  );
}
