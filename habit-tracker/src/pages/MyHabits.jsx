import { Link } from "react-router-dom";
import { useHabits } from "../utils/useHabits";
import { currentStreak, longestStreak } from "../utils/habits";
import { showConfirm, showToast } from "../components/Toast";
import "./MyHabits.css";

export default function MyHabits() {
  const { habits, deleteHabit } = useHabits();

  const handleDelete = async (h) => {
    const yes = await showConfirm(`Delete "${h.name}"? This can't be undone.`);
    if (yes) {
      deleteHabit(h.id);
      showToast(`"${h.name}" deleted.`, "danger");
    }
  };

  return (
    <div className="page my-habits-page">
      <div className="my-habits-header">
        <div>
          <span className="eyebrow">My Habits</span>
          <h1>Every routine you're running</h1>
        </div>
        <Link to="/habits/new" className="btn btn-primary">
          + Add Habit
        </Link>
      </div>

      {habits.length === 0 ? (
        <div className="card empty-state">
          <p>No habits yet. Define your first routine to start a streak.</p>
          <Link to="/habits/new" className="btn btn-primary">
            Create your first habit
          </Link>
        </div>
      ) : (
        <ul className="habit-list">
          {habits.map((h) => (
            <li key={h.id} className="card habit-list-row">
              <span className="habit-dot" style={{ background: h.color }} />
              <div className="habit-list-info">
                <strong>{h.name}</strong>
                <span className="habit-list-meta">
                  {h.category} · {h.frequency}
                </span>
                {h.notes && (
                  <span className="habit-list-notes">{h.notes}</span>
                )}
              </div>
              <div className="habit-list-streaks">
                <span>🔥 {currentStreak(h)}d current</span>
                <span>🏆 {longestStreak(h)}d best</span>
              </div>
              <div className="habit-list-actions">
                <Link to={`/habits/edit/${h.id}`} className="btn btn-ghost">
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(h)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
