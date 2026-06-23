import { useEffect, useState, useCallback } from "react";
import { loadHabits, saveHabits } from "./habits";

export function useHabits() {
  const [habits, setHabits] = useState(null); // null = not yet hydrated

  useEffect(() => {
    // Slight delay so React paints the skeleton first
    const timer = setTimeout(() => setHabits(loadHabits()), 80);
    const sync = () => setHabits(loadHabits());
    window.addEventListener("ht_habits_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("ht_habits_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((next) => {
    setHabits(next);
    saveHabits(next);
  }, []);

  const addHabit = useCallback(
    (habit) => update([...loadHabits(), habit]),
    [update]
  );

  const editHabit = useCallback(
    (id, patch) =>
      update(loadHabits().map((h) => (h.id === id ? { ...h, ...patch } : h))),
    [update]
  );

  const deleteHabit = useCallback(
    (id) => update(loadHabits().filter((h) => h.id !== id)),
    [update]
  );

  const replaceHabit = useCallback(
    (updated) =>
      update(loadHabits().map((h) => (h.id === updated.id ? updated : h))),
    [update]
  );

  return {
    habits: habits ?? [],
    loading: habits === null,
    addHabit,
    editHabit,
    deleteHabit,
    replaceHabit,
    setHabits: update,
  };
}
