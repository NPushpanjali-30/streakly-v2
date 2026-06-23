import { useMemo } from "react";
import { useHabits } from "../utils/useHabits";
import {
  currentStreak,
  longestStreak,
  completionRate,
  momentumScore,
} from "../utils/habits";
import ConsistencyGrid from "./ConsistencyGrid";
import WeekChart from "../components/WeekChart";
import "./Insights.css";

export default function Insights() {
  const { habits } = useHabits();

  const totals = useMemo(() => {
    if (habits.length === 0) {
      return { total: 0, completion: 0, longest: 0, current: 0 };
    }
    const longest = Math.max(...habits.map(longestStreak));
    const current = Math.max(...habits.map(currentStreak));
    const completion = Math.round(
      habits.reduce((s, h) => s + completionRate(h, 7), 0) / habits.length
    );
    return { total: habits.length, completion, longest, current };
  }, [habits]);

  const bestHabit = useMemo(() => {
    if (habits.length === 0) return null;
    return habits.reduce((best, h) => {
      const rate = completionRate(h, 30);
      const bestRate = best ? completionRate(best, 30) : -1;
      return rate > bestRate ? h : best;
    }, null);
  }, [habits]);

  return (
    <div className="page insights-page">
      <span className="eyebrow">Insights</span>
      <h1>How consistent are you, really?</h1>

      {habits.length === 0 ? (
        <div className="card empty-state">
          <p>Add a few habits and check in for a couple of days to unlock insights.</p>
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <StatTile label="Total habits" value={totals.total} />
            <StatTile label="7-day completion" value={`${totals.completion}%`} />
            <StatTile label="Longest streak" value={`${totals.longest}d`} />
            <StatTile label="Current best streak" value={`${totals.current}d`} />
          </div>

          {bestHabit && (
            <div className="card best-habit-card">
              <span className="best-habit-icon">🏆</span>
              <div>
                <span className="eyebrow">Best habit, last 30 days</span>
                <h3>{bestHabit.name}</h3>
                <p>{completionRate(bestHabit, 30)}% completion rate</p>
              </div>
            </div>
          )}

          <h2 className="section-title">Per-habit breakdown</h2>
          <div className="per-habit-grid">
            {habits.map((h) => (
              <div key={h.id} className="card per-habit-card">
                <div className="per-habit-top">
                  <span className="habit-dot" style={{ background: h.color }} />
                  <strong>{h.name}</strong>
                </div>
                <div className="per-habit-stats">
                  <span>🔥 {currentStreak(h)}d streak</span>
                  <span>{completionRate(h, 7)}% / 7d</span>
                </div>
                <MomentumBar score={momentumScore(h)} />
              </div>
            ))}
          </div>

          <WeekChart habits={habits} />

          <ConsistencyGrid habits={habits} />
        </>
      )}
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="card stat-tile">
      <span className="stat-tile-value">{value}</span>
      <span className="stat-tile-label">{label}</span>
    </div>
  );
}

function MomentumBar({ score }) {
  return (
    <div className="momentum-bar-wrap" title="Habit Momentum: recency-weighted score">
      <div className="momentum-bar-track">
        <div
          className="momentum-bar-fill"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="momentum-bar-score">{score}</span>
    </div>
  );
}
