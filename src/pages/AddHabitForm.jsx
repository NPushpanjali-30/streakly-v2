import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHabits } from "../utils/useHabits";
import { createHabit, CATEGORIES, FREQUENCIES } from "../utils/habits";
import { showToast } from "../components/Toast";
import "./AddHabitForm.css";

const PRESET_COLORS = ["#5EE6C4", "#F2A65A", "#E85D75", "#6C8CFF", "#C792EA", "#FFD166"];

export default function AddHabitForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { habits, addHabit, editHabit } = useHabits();
  const existing = id ? habits.find((h) => h.id === id) : null;

  const [form, setForm] = useState({
    name: existing?.name ?? "",
    category: existing?.category ?? "",
    frequency: existing?.frequency ?? "",
    notes: existing?.notes ?? "",
    color: existing?.color ?? PRESET_COLORS[0],
  });
  const [touched, setTouched] = useState({
    name: false,
    category: false,
    frequency: false,
  });
  const [success, setSuccess] = useState(false);

  const errors = {
    name: form.name.trim() ? "" : "Give your habit a name.",
    category: form.category ? "" : "Pick a category.",
    frequency: form.frequency ? "" : "Pick how often you'll do this.",
  };

  const allFilled = form.name.trim() && form.category && form.frequency;

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleBlur = (field) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allFilled) return;

    if (existing) {
      editHabit(existing.id, { ...form });
      showToast(`"${form.name}" updated!`, "success");
    } else {
      addHabit(createHabit(form));
      showToast(`"${form.name}" added — streak starts now!`, "success");
    }

    setSuccess(true);
    setTimeout(() => navigate("/dashboard"), 900);
  };

  return (
    <div className="page add-habit-page">
      <span className="eyebrow">{existing ? "Edit habit" : "New habit"}</span>
      <h1>{existing ? "Update your routine" : "Define the routine"}</h1>
      <p>Name it, file it, and set the cadence — the streak starts the moment you save.</p>

      <form className="card habit-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Habit name</span>
          <input
            type="text"
            placeholder="e.g. Read 10 pages"
            value={form.name}
            onChange={handleChange("name")}
            onBlur={handleBlur("name")}
          />
          {touched.name && errors.name && (
            <span className="field-error">{errors.name}</span>
          )}
        </label>

        <label className="form-field">
          <span>Category</span>
          <select
            value={form.category}
            onChange={handleChange("category")}
            onBlur={handleBlur("category")}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {touched.category && errors.category && (
            <span className="field-error">{errors.category}</span>
          )}
        </label>

        <label className="form-field">
          <span>Frequency</span>
          <select
            value={form.frequency}
            onChange={handleChange("frequency")}
            onBlur={handleBlur("frequency")}
          >
            <option value="">Select frequency</option>
            {FREQUENCIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          {touched.frequency && errors.frequency && (
            <span className="field-error">{errors.frequency}</span>
          )}
        </label>

        {/* Color picker */}
        <div className="form-field">
          <span>Habit color</span>
          <div className="color-swatches">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={"color-swatch" + (form.color === c ? " selected" : "")}
                style={{ background: c }}
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                aria-label={`Pick color ${c}`}
                aria-pressed={form.color === c}
              />
            ))}
          </div>
        </div>

        <label className="form-field">
          <span>
            Why this habit matters{" "}
            <span className="field-optional">(optional)</span>
          </span>
          <textarea
            placeholder="e.g. To build focus and reduce phone time before bed"
            value={form.notes}
            onChange={handleChange("notes")}
            rows={3}
            className="notes-textarea"
          />
        </label>

        <button type="submit" className="btn btn-primary" disabled={!allFilled}>
          {existing ? "Save changes" : "Add Habit"}
        </button>

        {success && (
          <div className="success-msg" role="status">
            ✓ Saved. Heading to your dashboard…
          </div>
        )}
      </form>
    </div>
  );
}
