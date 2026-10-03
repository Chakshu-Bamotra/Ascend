# Phase 3 — Exercise Library

Goal: fast search over a bundled preset library plus user-created custom exercises. Used by the "Add exercise" picker in Phase 4.

## Enums
```ts
type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms'
  | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'abs' | 'traps' | 'lats' | 'full_body';
type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight'
  | 'kettlebell' | 'band' | 'smith' | 'other';
```

## Preset library
- `features/exercises/presets.ts` (typed const array, not remote). Target ~120–150 exercises covering all muscle groups and equipment.
- IDs are stable slugs: `bench-press-barbell`, `pull-up`, `assisted-pull-up-machine`. **Never rename or reuse an ID** once shipped — workouts and PRs reference them.
- Correct `loadType` per exercise:
  - `weighted`: barbell/dumbbell/machine/cable lifts
  - `bodyweight`: push-up, plank-style rep work, air squat
  - `bodyweight_plus`: weighted-capable bodyweight moves — pull-up, chin-up, dip (added weight optional; blank = 0)
  - `assisted`: assisted pull-up/dip machine, band-assisted variants
- Write the list yourself; no copyrighted datasets or images. Names only, no images in v1.

## Custom exercises
- Stored at `users/{uid}/customExercises/{id}`, same `Exercise` shape, `source: 'custom'`, plus `createdAt/updatedAt/schemaVersion`.
- Create screen (`exercises/new`): name (required, 1–50, unique case-insensitively against presets + user's customs), primary muscle, equipment, load type. Secondary muscles optional.
- Edit + delete from a long-press or detail menu. Deleting a custom exercise does NOT touch past workouts (they hold a name snapshot). Deleted exercise's PR doc is deleted too.
- Hook: `useCustomExercises()` → Firestore snapshot listener, cached.

## Combined access
- `useExerciseCatalog()` → presets + customs merged, sorted by name, with `getById(id)`.
- `getById` must handle an unknown id gracefully (return null; callers fall back to the snapshot name).

## Picker screen (`workout/add-exercise`)
- Search input at top (case/diacritic-insensitive, matches name words in any order, e.g. "press bench").
- Filter chips: muscle group, equipment (horizontally scrollable, multi-select within a row).
- Sections: "Recent" (last ~10 distinct exercises used, derived from history in Phase 5; empty/hidden before that), then A–Z list.
- Custom exercises marked with a small "Custom" tag.
- Multi-select mode: tap to select several, "Add (n)" button adds all in selection order. A second action "Add as superset" (enabled when ≥2 selected) — wired in Phase 4.
- "Create exercise" row at bottom and when search has no results (prefill name with query).
- Must stay smooth with FlatList (memoized rows, `getItemLayout` if fixed height).

## Acceptance
- [ ] Search returns results as you type with no visible lag.
- [ ] Filters combine with search correctly.
- [ ] Create custom → appears immediately in picker; duplicate names rejected.
- [ ] Edit/delete custom works; presets cannot be edited/deleted.
- [ ] All preset IDs unique (unit test).
