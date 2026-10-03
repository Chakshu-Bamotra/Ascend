# Phase 1 — Foundation

Goal: a clean, empty-but-real app that builds as an Android development build, talks to Firebase, and has the theme + UI kit every later phase uses. No features yet.

## 1. Project
- Fresh Expo SDK 57 project, TypeScript template, Expo Router with `src/app`.
- `tsconfig.json`: `strict: true`, path alias `@/*` → `src/*`.
- Enable typed routes.
- ESLint (expo config) + Prettier. Scripts: `lint`, `typecheck`, `format`.
- `app.json` / `app.config.ts`: name `Ascend`, slug `ascend`, Android package `com.ascend.fitness`, `userInterfaceStyle: automatic`, portrait only.
- Do NOT copy code from the old repo. Only reuse ideas.

## 2. Firebase
- Create Firebase project `ascend` (prod). Optionally a second project `ascend-dev`.
- Add Android app with package `com.ascend.fitness`, download `google-services.json`, reference it via `android.googleServicesFile`.
- Install `@react-native-firebase/app`, `/auth`, `/firestore` + required config plugins (check RNFirebase Expo docs for current plugin list and any `expo-build-properties` settings).
- `google-services.json` is gitignored for public repos; document how to obtain it in README.
- Build a development build (`npx expo run:android` or EAS dev profile). Expo Go will not work.
- `src/lib/firebase.ts` exports `auth`, `db` instances (modular API) and nothing else.
- Firestore: create database, start in **locked mode**. Temporary rule for Phase 1–6 development:
  ```
  match /users/{uid}/{document=**} {
    allow read, write: if request.auth != null && request.auth.uid == uid;
  }
  ```
  (Hardened in Phase 7.)

## 3. Theme
`src/theme/`:
- `tokens.ts`: spacing scale (4-based: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48), radius (sm 8, md 12, lg 16, full 999), font sizes (xs 12, sm 14, md 16, lg 18, xl 22, 2xl 28, 3xl 34), font weights.
- `palettes.ts`: `light` and `dark` palettes with the same keys: `background`, `surface`, `surfaceAlt`, `border`, `text`, `textMuted`, `primary`, `onPrimary`, `success`, `warning`, `danger`, `pr` (PR badge color), set-type colors `warmup`, `drop`, `failure`.
- `useTheme()` returns `{ colors, spacing, radius, font, scheme }`. Scheme = user preference (`system|light|dark`, from a Zustand `settingsStore`, default `system`) resolved against `useColorScheme()`.
- `makeStyles(fn)` helper: `const useStyles = makeStyles((t) => StyleSheet.create({...}))` memoized per scheme.
- Status bar + navigation bar + root background follow the theme (use `expo-system-ui` for the root background).
- Pick one clean font (e.g. Inter via `expo-font`) or use system font. Decide once, apply globally.

## 4. UI kit (`src/components/ui/`)
Build only these, fully typed, themed, accessible (labels, 44px min touch targets):
- `Screen` (safe area, optional scroll, keyboard avoiding)
- `Text` (variants: title, heading, body, caption, label; `muted` prop)
- `Button` (variants: primary, secondary, ghost, danger; sizes sm/md/lg; `loading`, `disabled`)
- `Input` (label, error text, secure toggle for passwords, numeric mode)
- `Card`
- `ListItem` (title, subtitle, left/right slots, onPress)
- `EmptyState` (icon, title, description, optional action)
- `Sheet` (bottom sheet/modal for pickers; simple Modal-based is fine)
- `Chip` (selectable filter chip)
- `Divider`, `Spinner`
- `ConfirmDialog` (title, message, confirm/cancel, destructive variant)

Icons: `@expo/vector-icons` (one family, e.g. Ionicons).

## 5. App shell
- Root `_layout.tsx`: providers (SafeArea, GestureHandler, QueryClientProvider, theme), then a `Stack`.
- `(tabs)/_layout.tsx`: three tabs — Home, History, Profile. Each renders a titled empty `Screen` for now (these are real screens filled in later phases, not "coming soon" messages).
- Placeholder auth gate: always goes to tabs in this phase (real gate in Phase 2).

## 6. Utilities
- `lib/units.ts`: `kgToLb`, `lbToKg`, `toDisplayWeight(kg, units)` → string (max 1 decimal, trailing `.0` dropped), `parseWeightInput(str, units)` → kg or null. Unit tests.
- `lib/time.ts`: `formatDuration(sec)` (`1h 05m`, `42m`, `0:45` for timers), `formatDate`, `formatRelativeDay`.
- `lib/id.ts`: short random id generator (for sets/instances; Firestore doc ids use Firestore auto ids).
- Jest (`jest-expo`) set up; tests for `units.ts` and `time.ts`.

## Acceptance
- [ ] Android dev build installs and launches on a real device/emulator.
- [ ] A test write/read to `users/{uid}` works after anonymous or manual test sign-in (then remove the test code).
- [ ] Three tabs render; switching device dark/light mode updates colors instantly.
- [ ] `lint`, `typecheck`, `test` pass.
- [ ] README: setup steps (Node version, Firebase config file, dev build command).
