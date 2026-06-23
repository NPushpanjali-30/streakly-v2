// ---- Constants ----
const HABITS_KEY = "ht_habits_v1";
const COLORS = ["#5EE6C4", "#F2A65A", "#E85D75", "#6C8CFF", "#C792EA", "#FFD166"];
export const CATEGORIES = ["Health", "Productivity", "Custom", "Learning", "Mindfulness"];
export const FREQUENCIES = ["Daily", "Weekly", "Custom"];

export function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// ---- Date helpers ----
export function todayStr(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return todayStr(d);
}

export function daysAgoStr(n) {
  return addDays(todayStr(), -n);
}

export function weekStartStr(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay(); // 0 = Sunday
  date.setDate(date.getDate() - day);
  return todayStr(date);
}

// ---- Persistence ----
export function loadHabits() {
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    window.dispatchEvent(new Event("ht_habits_updated"));
  } catch {
    /* storage unavailable */
  }
}

export function createHabit({ name, category, frequency, notes = "", color }) {
  const now = new Date();
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    category,
    frequency,
    notes,
    color: color ?? randomColor(),
    createdAt: todayStr(now),
    checkins: [], // array of "YYYY-MM-DD" strings
    freeze: { weekStart: weekStartStr(now), used: false },
  };
}

// ---- Checkin logic ----
export function isCheckedOn(habit, dateStr) {
  return habit.checkins.includes(dateStr);
}

export function isCheckedToday(habit) {
  return isCheckedOn(habit, todayStr());
}

export function toggleCheckin(habit) {
  const t = todayStr();
  const checked = isCheckedOn(habit, t);
  const checkins = checked
    ? habit.checkins.filter((c) => c !== t)
    : [...habit.checkins, t].sort();
  return { ...habit, checkins };
}

// current streak = consecutive days (ending today or yesterday) with a checkin
export function currentStreak(habit) {
  const set = new Set(habit.checkins);
  let streak = 0;
  let cursor = todayStr();
  // if today isn't checked yet, streak counts up to yesterday (still "alive")
  if (!set.has(cursor)) {
    cursor = addDays(cursor, -1);
  }
  while (set.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// longest streak ever, scanning all checkins
export function longestStreak(habit) {
  const sorted = [...habit.checkins].sort();
  if (sorted.length === 0) return 0;
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (addDays(sorted[i - 1], 1) === sorted[i]) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }
  return longest;
}

export function completionRate(habit, windowDays) {
  let done = 0;
  for (let i = 0; i < windowDays; i++) {
    if (isCheckedOn(habit, daysAgoStr(i))) done += 1;
  }
  return Math.round((done / windowDays) * 100);
}

// Momentum: weighted score 0-100, recency weighted heavier than history.
// Last 7 days weighted 3x, last 30 days weighted 1x (excluding overlap).
export function momentumScore(habit) {
  let recentDone = 0;
  for (let i = 0; i < 7; i++) if (isCheckedOn(habit, daysAgoStr(i))) recentDone++;
  let olderDone = 0;
  for (let i = 7; i < 30; i++) if (isCheckedOn(habit, daysAgoStr(i))) olderDone++;

  const recentScore = (recentDone / 7) * 70; // up to 70 pts
  const olderScore = (olderDone / 23) * 30; // up to 30 pts
  return Math.round(recentScore + olderScore);
}

export function totalCheckins(habits) {
  return habits.reduce((sum, h) => sum + h.checkins.length, 0);
}

/**
 * isDueToday: returns true if the habit should show a "due" indicator.
 * - Daily: always due.
 * - Weekly: due if the user hasn't checked in at all during the current
 *   calendar week (Sun–Sat). Once they have ≥1 check-in this week, it's satisfied.
 * - Custom: same as Weekly for simplicity (1 check-in per week satisfies it).
 */
export function isDueToday(habit) {
  if (habit.frequency === "Daily") return true;
  // Weekly / Custom: satisfied if ≥1 check-in this calendar week
  const ws = weekStartStr();
  for (let i = 0; i < 7; i++) {
    if (isCheckedOn(habit, addDays(ws, i))) return false; // already done this week
  }
  return true; // no check-in yet this week → still due
}

/**
 * weekCheckins: count of check-ins this calendar week for a habit.
 */
export function weekCheckins(habit) {
  const ws = weekStartStr();
  let count = 0;
  for (let i = 0; i < 7; i++) {
    if (isCheckedOn(habit, addDays(ws, i))) count++;
  }
  return count;
}

// ---- Freeze token (one per calendar week) ----
export function ensureFreezeForWeek(habit) {
  const ws = weekStartStr();
  if (habit.freeze?.weekStart !== ws) {
    return { ...habit, freeze: { weekStart: ws, used: false } };
  }
  return habit;
}

export function useFreeze(habit) {
  const fresh = ensureFreezeForWeek(habit);
  if (fresh.freeze.used) return fresh;
  // applies freeze to yesterday, protecting the streak chain
  const yesterday = addDays(todayStr(), -1);
  const checkins = fresh.checkins.includes(yesterday)
    ? fresh.checkins
    : [...fresh.checkins, yesterday].sort();
  return { ...fresh, checkins, freeze: { ...fresh.freeze, used: true } };
}

// ---- Pin to top ----
export function togglePin(habit) {
  return { ...habit, pinned: !habit.pinned };
}

export function sortHabits(habits) {
  return [...habits].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });
}
