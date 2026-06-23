import { useMemo, useState } from "react";
import { daysAgoStr, isCheckedOn } from "../utils/habits";
import "./Heatmap.css";

export default function Heatmap({ habits, days = 30 }) {
  const [hovered, setHovered] = useState(null);

  const cells = useMemo(() => {
    const arr = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = daysAgoStr(i);
      const count = habits.filter((h) => isCheckedOn(h, date)).length;
      arr.push({ date, count });
    }
    return arr;
  }, [habits, days]);

  const max = Math.max(1, ...cells.map((c) => c.count));

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-grid" style={{ "--cols": Math.min(days, 15) }}>
        {cells.map((c) => {
          const intensity = c.count === 0 ? 0 : c.count / max;
          return (
            <div
              key={c.date}
              className="heatmap-cell"
              style={{ "--intensity": intensity }}
              onMouseEnter={() => setHovered(c)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(c)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
            >
              {hovered?.date === c.date && (
                <span className="heatmap-tooltip">
                  {c.date} · {c.count} done
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
