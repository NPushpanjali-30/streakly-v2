import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useHabits } from "../utils/useHabits";
import { currentStreak, completionRate, totalCheckins } from "../utils/habits";
import "./Home.css";

export default function Home() {
  const { habits } = useHabits();

  const bestStreak = useMemo(
    () => habits.reduce((m, h) => Math.max(m, currentStreak(h)), 0),
    [habits]
  );

  const avgCompletion = useMemo(() => {
    if (habits.length === 0) return 0;
    const sum = habits.reduce((s, h) => s + completionRate(h, 7), 0);
    return Math.round(sum / habits.length);
  }, [habits]);

  const checkins = totalCheckins(habits);

  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-left">
          <span className="eyebrow">Build the streak, not just the habit</span>
          <h1 className="hero-title">
            Small reps, every day.
            <br />
            That's the whole game.
          </h1>
          <p className="hero-sub">
            Streakly tracks every check-in, finds your real consistency, and
            keeps the fire lit — even when life gets busy.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{bestStreak}</span>
              <span className="hero-stat-label">day best streak</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{avgCompletion}%</span>
              <span className="hero-stat-label">7-day completion</span>
            </div>
          </div>

          <Link to="/dashboard" className="btn btn-primary hero-cta">
            Begin Tracking →
          </Link>
        </div>

        <div className="hero-right">
          <FlameIllustration />
        </div>
      </section>

      <section className="global-stat-band">
        <div className="global-stat-card">
          <span className="global-stat-label">Total check-ins logged, all-time</span>
          <span className="global-stat-num" key={checkins}>
            {checkins.toLocaleString()}
          </span>
        </div>
      </section>
    </div>
  );
}

function FlameIllustration() {
  return (
    <svg viewBox="0 0 360 360" className="flame-illustration" aria-hidden="true">
      <circle cx="180" cy="180" r="150" fill="var(--bg-card)" stroke="var(--border)" />
      <g className="flame-pulse">
        <path
          d="M180 90c-40 56-72 92-72 138a72 72 0 00144 0c0-24-12-42-24-54 4 24-8 36-18 30
             10-22-4-50-30-114z"
          fill="var(--ember)"
        />
        <path
          d="M180 150c-20 30-36 50-36 76a36 36 0 0072 0c0-12-6-21-12-27 2 12-4 18-9 15
             5-11-2-25-15-64z"
          fill="var(--accent)"
          opacity="0.85"
        />
      </g>
      <g className="flame-sparks">
        <circle cx="120" cy="120" r="4" fill="var(--accent)" />
        <circle cx="250" cy="100" r="3" fill="var(--ember)" />
        <circle cx="265" cy="220" r="5" fill="var(--accent)" />
      </g>
    </svg>
  );
}
