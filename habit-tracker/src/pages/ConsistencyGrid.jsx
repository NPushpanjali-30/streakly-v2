import { useMemo, useState } from "react";
import Heatmap from "../components/Heatmap";
import { currentStreak } from "../utils/habits";
import { CATEGORIES } from "../utils/habits";
import "./ConsistencyGrid.css";

function motivationalMessage(streak) {
  if (streak === 0) return "Let's start fresh today 🚀";
  if (streak < 3) return "Good start, keep going 💪";
  if (streak <= 7) return "Momentum is building — don't break it now 🌱";
  if (streak <= 30) return "You're on fire 🔥";
  return "This isn't a streak anymore. It's an identity. 🏔️";
}

export default function ConsistencyGrid({ habits }) {
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(
    () => (filter === "All" ? habits : habits.filter((h) => h.category === filter)),
    [habits, filter]
  );

  const bestStreak = useMemo(
    () => habits.reduce((m, h) => Math.max(m, currentStreak(h)), 0),
    [habits]
  );

  return (
    <section className="consistency-grid">
      <div className="consistency-header">
        <h2>Consistency, mapped</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="consistency-message">{motivationalMessage(bestStreak)}</p>

      <Heatmap habits={filtered} days={30} />
    </section>
  );
}
