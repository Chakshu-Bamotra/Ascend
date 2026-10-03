# Ascend — Overview & Decisions

Read this file before every phase. Phases are built in order; each phase must pass its acceptance criteria before the next starts.

## Product
Ascend is a strength-training workout logger. v1 = workout logging only. Free, no ads, no paywall. Android launch first (Play Store), iOS later from the same codebase.

## Locked decisions
| Area | Decision |
|---|---|
| Framework | Expo SDK 57, React Native, **development builds** (not Expo Go) |
| Language | TypeScript, `strict: true` |
| Routing | Expo Router (file-based, typed routes) |
| Backend | Firebase via **React Native Firebase** (`@react-native-firebase/app`, `/auth`, `/firestore`, `/crashlytics` in Phase 7). Modular API only. |
| Auth | Email + password only (plus forgot password, email verification optional/not blocking) |
| State | Zustand (client/UI state, active workout), TanStack Query (Firestore reads for history/lists) |
| Styling | `StyleSheet` + typed theme tokens via `useTheme()`. No styling library. |
| Theme | Light + dark, follows system by default; user can override (System / Light / Dark) |
| Units | User picks kg or lb. **Always store kg** in Firestore; convert only for input/display |
| Connectivity | Online app. Firestore's default offline persistence stays ON (writes queue if signal drops mid-workout). No custom sync layer. |
| Exercises | Bundled preset library (JSON in app) + user custom exercises (Firestore) |
| Set load types | Weighted, bodyweight, bodyweight + added weight, assisted |
| Set types | Normal, warm-up, drop, failure. Supersets via grouping. |
| v1 extras | Rest timer, PR detection, workout history + stats |
| Not in v1 | Nutrition, programs/templates, progress photos/weight/charts, previous-session prefill, social, AI, subscriptions, wearables |
| Onboarding | Name + preferred units only |
| Bundle ID | `com.ascend.fitness` |

Before writing code in any phase, check the versioned Expo docs: https://docs.expo.dev/versions/v57.0.0/ and the React Native Firebase docs for Expo config plugins. Do not rely on memory for install steps.

## Folder structure
```
src/
  app/                        # Expo Router routes only (thin; delegate to features)
    _layout.tsx               # providers + auth gate
    (auth)/sign-in.tsx, sign-up.tsx, forgot-password.tsx
    (onboarding)/index.tsx
    (tabs)/_layout.tsx
    (tabs)/index.tsx          # Home
    (tabs)/history/index.tsx
    (tabs)/history/[id].tsx
    (tabs)/profile.tsx
    workout/active.tsx
    workout/add-exercise.tsx
    workout/summary/[id].tsx
    exercises/new.tsx
  features/
    auth/        # service, hooks, validation
    profile/     # user doc, settings
    exercises/   # preset data, custom exercises, search
    workout/     # active workout store, set logic, rest timer
    history/     # queries, stats
    records/     # PR detection + storage
  components/ui/ # Button, Input, Text, Card, Screen, Sheet, EmptyState, etc.
  lib/
    firebase.ts  # single place that imports RNFirebase
    units.ts     # kg<->lb, formatting
    time.ts      # durations, dates
    id.ts        # id generation
  theme/         # tokens, light/dark palettes, useTheme
  types/         # shared domain types
```

## Conventions
- No `any`. Domain types live in `src/types/`. Firestore converters validate shape on read.
- Only `src/lib/firebase.ts` and `features/*/service.ts` files touch Firebase directly. Screens never call Firestore.
- Routes in `src/app` stay thin: layout + call a feature screen component.
- All user-facing weights pass through `lib/units.ts`. Never format weight inline.
- One component per file. Named exports, except route files (Expo Router needs default exports).
- Every Firestore doc has `schemaVersion: 1`, `createdAt`, `updatedAt` (server timestamps).
- ESLint + Prettier + `tsc --noEmit` must pass before a phase is done.
- No placeholder "coming soon" screens. If it's not in v1, it doesn't appear.

## Data model (Firestore)
```
users/{uid}
  name: string
  units: 'kg' | 'lb'
  themePreference: 'system' | 'light' | 'dark'
  defaultRestSeconds: number        # default 90
  onboardedAt: Timestamp | null
  schemaVersion, createdAt, updatedAt

users/{uid}/customExercises/{exerciseId}
  (Exercise shape, source: 'custom')

users/{uid}/state/activeWorkout     # single doc; exists only while a workout is running
  (Workout shape, status: 'active')

users/{uid}/workouts/{workoutId}    # completed workouts only
  (Workout shape, status: 'completed') + stats

users/{uid}/records/{exerciseId}    # current PRs per exercise
  (ExerciseRecord shape)
```

## Core types
```ts
type LoadType = 'weighted' | 'bodyweight' | 'bodyweight_plus' | 'assisted';
type SetType = 'normal' | 'warmup' | 'drop' | 'failure';

interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  loadType: LoadType;
  source: 'preset' | 'custom';
}

interface WorkoutSet {
  id: string;
  type: SetType;
  weightKg: number | null;   // weighted: load. bodyweight_plus: added. assisted: assistance. bodyweight: null
  reps: number | null;
  completed: boolean;
  completedAt: number | null; // epoch ms
}

interface WorkoutExercise {
  id: string;            // instance id within this workout
  exerciseId: string;
  exerciseName: string;  // denormalized snapshot
  loadType: LoadType;    // snapshot
  supersetId: string | null;
  notes: string;
  sets: WorkoutSet[];
}

interface Workout {
  id: string;
  name: string;
  status: 'active' | 'completed';
  startedAt: number;
  endedAt: number | null;
  exercises: WorkoutExercise[];
  stats?: WorkoutStats;  // only when completed
  prs?: PrHit[];         // PRs set in this workout
}

interface WorkoutStats {
  durationSec: number;
  exerciseCount: number;
  workingSets: number;   // completed, non-warmup
  totalReps: number;
  volumeKg: number;      // sum(weight*reps) over working sets, weighted + bodyweight_plus only
}
```

## Phases
1. `01-FOUNDATION.md` — project, TS, tooling, theme, UI kit, Firebase wiring, route shell
2. `02-AUTH-ONBOARDING.md` — email auth, auth gate, onboarding (name + units)
3. `03-EXERCISE-LIBRARY.md` — preset data, search/filter, custom exercises
4. `04-WORKOUT-LOGGING.md` — active workout, sets, set types, supersets, rest timer
5. `05-HISTORY-STATS-PRS.md` — finish flow, PR detection, history, stats
6. `06-PROFILE-SETTINGS.md` — units, theme, rest default, sign out, delete account
7. `07-ANDROID-RELEASE.md` — security rules, Crashlytics, EAS build, Play Store
