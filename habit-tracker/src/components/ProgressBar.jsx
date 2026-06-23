import "./ProgressBar.css";

export default function ProgressBar({ done, total }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>Today's progress</span>
        <span>
          {done}/{total} habits
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
