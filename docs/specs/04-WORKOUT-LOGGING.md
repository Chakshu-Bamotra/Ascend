# Phase 4 — Workout Logging

Goal: the core of the app. Start a workout, add exercises, log sets fast, supersets, set types, rest timer. Must feel instant.

## Storage model
- Active workout lives in `useActiveWorkoutStore` (Zustand) as the source of truth while running.
- Mirrored to `users/{uid}/state/activeWorkout`:
  - Debounced write (~1.5s after last change) + immediate write on: add/remove exercise, finish, app going to background (`AppState`).
  - On app start (after auth), read the doc; if it exists, the Home screen shows a "Resume workout" banner.
- Only one active workout at a time. Starting a new one when one exists → confirm "Discard current workout?".
- Firestore offline persistence means writes queue if signal drops; no extra handling needed, but never block UI on a write.

## Home tab
- Primary button "Start workout" (or "Resume workout · 32m" when active).
- Below: last 3 completed workouts (compact cards) → tap opens detail (Phase 5). Empty state before any workout.

## Active workout screen (`workout/active`)
Header:
- Editable workout name (default by time of day: "Morning Workout" / "Afternoon Workout" / "Evening Workout").
- Live elapsed timer (derived from `startedAt`, not an incrementing counter).
- "Finish" button (Phase 5 builds the finish flow; here it just calls `finishWorkout()` stub that validates and ends).
- Overflow: "Discard workout" (confirm).

Body: list of exercise blocks. Footer: "Add exercises" button → picker.

### Exercise block
- Title (exercise name), load-type-aware column headers, overflow menu: add note, replace exercise, reorder (move up/down), remove from superset / create superset with next, remove exercise (confirm if it has completed sets).
- Superset members render grouped with a colored left rail and a label ("Superset A").
- Set rows, then "+ Add set".

### Set row
Columns: `Set` | load input | `Reps` | ✓
- **Set label** tappable → sheet to choose type: Normal / Warm-up / Drop / Failure. Display: normal = number (counting only normal+drop+failure sets), warm-up = `W`, drop = `D`, failure = `F`, each with its theme color.
- **Load input** by `loadType`:
  - `weighted`: weight in user units.
  - `bodyweight`: shows "BW", no input.
  - `bodyweight_plus`: "+ weight" input (blank = bodyweight only).
  - `assisted`: "− weight" input (assistance amount).
- **Reps**: integer input, numeric keypad.
- **✓**: marks complete. Requires reps ≥ 1 (and weight ≥ 0 when weighted; blank weight on `weighted` = invalid → shake + highlight). Completing a set:
  - row turns success-tinted,
  - sets `completedAt`,
  - starts rest timer (see superset rule),
  - runs live PR check (Phase 5 plugs in; leave a hook `onSetCompleted(exercise, set)`).
- Un-checking a completed set is allowed (clears `completedAt`).
- Swipe left to delete a set.
- New set via "+ Add set" copies the previous set's weight/reps/type (except warm-up → new set is normal).
- Inputs: store weight as kg internally, convert through `lib/units.ts`. Decimal input accepts `.` and `,`.
- Keyboard: "Next" moves weight → reps → next set's weight.

### Supersets
- Created from picker ("Add as superset") or block menu ("Superset with next").
- `supersetId` shared by grouped exercises; consecutive in the list. Moving one member moves the group together.
- Removing to <2 members dissolves the group.
- **Rest rule:** completing a set in a superset starts rest only if it's the last exercise in the group for that round; otherwise no timer.

## Rest timer
- Store: `restEndsAt: number | null`, `restDurationSec`. Countdown is `restEndsAt - Date.now()` recalculated on a 250ms tick → accurate after backgrounding.
- Default duration = `users/{uid}.defaultRestSeconds` (90). Per-exercise override via block menu "Rest time" (30s–5m, 15s steps), stored on the WorkoutExercise as `restSeconds?: number`.
- UI: sticky bar above footer with remaining time, progress bar, `−15s`, `+15s`, `Skip`.
- On finish: vibration (`expo-haptics`) + short sound if app in foreground. If app backgrounded: local notification scheduled at `restEndsAt` via `expo-notifications` (request permission the first time a timer starts; if denied, silently skip notifications). Cancel/reschedule on skip/adjust.
- Timer is not persisted across app kills beyond `restEndsAt` (if expired on reopen, just hide).

## Finish (minimum for this phase)
- If no completed sets: dialog "No completed sets — discard workout?".
- If some sets incomplete: dialog "Finish with n incomplete sets? They'll be removed."
- Phase 5 adds saving, stats, and PRs.

## Performance
- Set rows memoized; typing in one input must not re-render all blocks. Select narrow Zustand slices.
- No Firestore write per keystroke (debounce rule above).

## Acceptance
- [ ] Log a 6-exercise, 20-set workout with no visible input lag on a mid-range Android phone.
- [ ] Kill app mid-workout → reopen → resume with all data intact.
- [ ] Switch units in settings (Phase 6) or mid-workout later → all displayed values convert correctly; stored kg unchanged.
- [ ] Rest timer correct after 2 minutes in background; notification fires when backgrounded.
- [ ] Superset rest rule works; group moves as one.
- [ ] Set numbering ignores warm-ups.
