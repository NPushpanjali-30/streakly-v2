import { useMemo } from "react";
import { isCheckedOn, daysAgoStr, todayStr, addDays, weekStartStr } from "../utils/habits";
import "./WeekChart.css";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeekChart({ habits }) {
  const bars = useMemo(() => {
    const ws = weekStartStr();
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(ws, i);
      const done = habits.filter((h) => isCheckedOn(h, date)).length;
      const total = habits.length;
      const pct = total === 0 ? 0 : Math.round((done / total) * 100);
      const dayName = DAY_LABELS[new Date(date + "T00:00:00").getDay()];
      const isToday = date === todayStr();
      const isFuture = date > todayStr();
      return { date, done, total, pct, dayName, isToday, isFuture };
    });
  }, [habits]);

  const maxDone = Math.max(...bars.map((b) => b.done), 1);
  const CHART_H = 80;

  return (
    <div className="week-chart card">
      <span className="eyebrow">This week</span>
      <h3>Daily check-ins</h3>
      <div className="week-chart-bars">
        {bars.map((b) => {
          const barH = b.isFuture ? 0 : Math.max(4, (b.done / maxDone) * CHART_H);
          return (
            <div key={b.date} className={"bar-col" + (b.isToday ? " today" : "") + (b.isFuture ? " future" : "")}>
              <span className="bar-count">{b.isFuture ? "" : b.done}</span>
              <div className="bar-track" style={{ height: CHART_H }}>
                <div
                  className="bar-fill"
                  style={{
                    height: barH,
                    background: b.isToday ? "var(--accent)" : "var(--ember)",
                    opacity: b.isFuture ? 0.15 : 1,
                  }}
                />
              </div>
              <span className="bar-label">{b.dayName}</span>
            </div>
          );
        })}
      </div>
      <p className="week-chart-sub">
        Bars show how many of your {habits.length} habit{habits.length !== 1 ? "s" : ""} were completed each day. Today is highlighted in teal.
      </p>
    </div>
  );
}
