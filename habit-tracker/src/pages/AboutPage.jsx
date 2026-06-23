import { useNavigate } from "react-router-dom";
import { loadHabits } from "../utils/habits";
import { showConfirm, showToast } from "../components/Toast";
import "./AboutPage.css";

function exportJSON() {
  const habits = loadHabits();
  const payload = {
    exportedAt: new Date().toISOString(),
    version: "1",
    habits,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `streakly-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("✓ Data exported as JSON.", "success");
}

export default function AboutPage() {
  const navigate = useNavigate();

  const handleReset = async () => {
    const confirmed = await showConfirm(
      "Reset all data? This deletes every habit and check-in from this browser. This can't be undone."
    );
    if (!confirmed) return;
    localStorage.clear();
    window.dispatchEvent(new Event("ht_habits_updated"));
    showToast("All data cleared.", "danger");
    navigate("/");
  };

  return (
    <div className="page about-page">
      <span className="eyebrow">About</span>
      <h1>Streakly</h1>
      <p>
        Streakly is a habit tracker and streak dashboard built for the Kshitij
        Web Development &amp; AI Workshop. It tracks daily habits, calculates
        current and longest streaks, visualizes consistency on a heatmap, and
        surfaces insights like completion rate and "habit momentum" — all
        without a backend, using nothing but localStorage.
      </p>

      <div className="card about-block">
        <h3>Tech stack</h3>
        <ul>
          <li>React (Vite, functional components + hooks)</li>
          <li>react-router-dom for client-side routing</li>
          <li>Plain CSS — CSS Grid for the heatmap, custom properties for theming</li>
          <li>localStorage as the only data layer (no backend)</li>
        </ul>
      </div>

      <div className="card about-block">
        <h3>What I learned</h3>
        <p>
          Turns out calculating a "streak" correctly is sneakier than it
          sounds — calendar math, timezones, and "is today done yet?" edge
          cases ate up more time than any animation did. Also: localStorage
          is a surprisingly capable little database when you respect its
          5MB ego.
        </p>
      </div>

      

      <div className="card about-block export-zone">
        <h3>Download my data</h3>
        <p>
          Export all your habits and check-in history as a JSON file.
          Your data stays in your browser — this just gives you a portable copy.
        </p>
        <button className="btn btn-ghost" onClick={exportJSON}>
          ⬇ Download data as JSON
        </button>
      </div>

      <div className="card about-block danger-zone">
        <h3>Danger zone</h3>
        <p>
          Wipe every habit and check-in stored in this browser. Useful for
          testing from a clean slate, or starting over.
        </p>
        <button className="btn btn-danger" onClick={handleReset}>
          Reset all data
        </button>
      </div>
    </div>
  );
}
