# Phase 5 — Finish Flow, PRs, History & Stats

## Working sets
A **working set** = completed set with `type !== 'warmup'`. Only working sets count toward stats and PRs.

## PR definitions (per exercise, per loadType)
| loadType | PRs tracked |
|---|---|
| weighted | Heaviest weight (any reps ≥1), Best est. 1RM, Best set volume (weight×reps) |
| bodyweight_plus | Most added weight, Most reps (any added weight, incl. 0) |
| bodyweight | Most reps in a set |
| assisted | Least assistance (for reps ≥ 1), Most reps |

- Est. 1RM = Epley: `w × (1 + reps/30)`; only for reps ≤ 12 (higher reps too inaccurate). reps = 1 → w.
- Compare in kg with a small epsilon (0.01) to avoid unit-rounding false PRs.
- Ties are not PRs.

### Record doc `users/{uid}/records/{exerciseId}`
```ts
interface ExerciseRecord {
  exerciseId: string;
  loadType: LoadType;
  heaviestKg?: RecordEntry;
  bestE1rmKg?: RecordEntry;
  bestSetVolumeKg?: RecordEntry;
  mostAddedKg?: RecordEntry;
  mostReps?: RecordEntry;
  leastAssistKg?: RecordEntry;
  updatedAt: Timestamp;
}
interface RecordEntry { value: number; weightKg: number | null; reps: number; workoutId: string; achievedAt: number; }
```
Pure function `detectPrs(set, exerciseLoadType, currentRecord, sessionBest)` → list of PR kinds. Unit-tested heavily.

### Live PR badge
- On set completion, compare against cached record (loaded when exercise is added) and best-so-far in this session. Show a small trophy badge on the row + light haptic. If un-checked, badge disappears.
- Records are only written on Finish.

## Finish flow
1. Validation dialogs from Phase 4.
2. Remove incomplete sets; remove exercises with zero completed sets.
3. Compute `WorkoutStats` (see overview) and final PR list.
4. **Single batched write:**
   - create `users/{uid}/workouts/{newId}` (status `completed`, `endedAt`, stats, prs)
   - upsert each affected `records/{exerciseId}`
   - delete `state/activeWorkout`
5. Clear store, navigate to `workout/summary/[id]` (replace, so back doesn't return to active workout).

Offline: batch commits locally and syncs later; UI proceeds immediately.

## Summary screen
- Name, date, duration, working sets, total reps, volume (user units).
- PR list with trophy icons ("Bench Press — Heaviest: 100 kg").
- Exercise breakdown: name + sets as `100 kg × 5`, `BW × 12`, `BW +10 kg × 8`, `BW −20 kg × 6`, with W/D/F markers.
- "Done" → Home.

## History tab
- Paginated list (TanStack `useInfiniteQuery`, 20 per page, `orderBy('endedAt', 'desc')`).
- Grouped by month headers.
- Card: name, date, duration, exercise count, volume, PR count badge.
- Pull to refresh. Empty state with "Start workout" action.

## Workout detail (`history/[id]`)
- Same layout as summary.
- Overflow: edit name, delete workout (confirm).
- **Delete + PRs:** after deleting, recompute records for affected exercises from remaining history (query workouts containing the exercise — store `exerciseIds: string[]` on each workout doc to allow `array-contains` queries). Recompute runs client-side, then batch-writes records.
- Editing sets of past workouts: not in v1.

## Exercise history (from picker or workout detail → tap exercise)
- Screen: current PRs for that exercise + list of past sessions (date + working sets). Uses `array-contains` query on `exerciseIds`.

## Stats (top of History tab)
Simple, no chart library:
- This week: workouts, total volume, working sets.
- Streak: consecutive weeks (Mon–Sun) with ≥1 workout.
- Last 8 weeks: workouts per week as a row of bars built with Views.
- All-time: total workouts, total volume.
Computed from a lightweight query (last 8 weeks) + a counters doc `users/{uid}/state/totals` (`workoutCount`, `volumeKg`) incremented in the finish batch with `increment()` and decremented on delete.

## Recent exercises (for Phase 3 picker)
- Derived from last ~10 workouts' `exerciseIds`, distinct, most recent first.

## Required indexes
- `workouts`: `endedAt desc` (single field, auto).
- `workouts`: `exerciseIds array-contains` + `endedAt desc` (composite; add to `firestore.indexes.json`).

## Acceptance
- [ ] Unit tests for `detectPrs`, stats calc, e1RM, streak.
- [ ] Finish creates workout, updates records, deletes active doc atomically.
- [ ] Deleting a workout that held a PR correctly restores the previous best.
- [ ] Warm-ups never produce PRs or count in stats.
- [ ] History scrolls smoothly with 200+ workouts (seed script for testing).
