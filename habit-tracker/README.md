# Streakly — Habit Tracker & Streak Dashboard

Built for the Kshitij Web Development & AI Workshop — Assignment 3 (ReactJS, JavaScript, CSS).

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL. Everything persists to `localStorage` — no backend needed.

## Routes

- `/` — Landing page with hero + live global check-in stat
- `/dashboard` — Daily Dashboard: today's habit cards, check-in, progress bar, Pomodoro
- `/habits` — My Habits: list, edit, delete
- `/habits/new`, `/habits/edit/:id` — Add/Edit Habit form
- `/insights` — Stats, best habit, habit momentum, consistency heatmap
- `/about` — About the project
- any other path — custom 404

## Notes on implementation choices

- **Streaks**: a streak day counts if there's a check-in for that calendar date.
  Current streak counts backward from today (or yesterday if today isn't
  checked in yet, so the streak stays "alive" until midnight).
- **Habit Momentum** (bonus): weights the last 7 days at 70% of the score and
  the prior 23 days at 30%, so recent consistency matters more than old history.
- **Freeze token**: one per habit per calendar week, stored in the habit's
  `freeze` field; spending it back-fills yesterday's check-in.
- **Pomodoro** (bonus): 25/5 timer that can be opened from any habit card and
  tracks focused minutes for that session.
