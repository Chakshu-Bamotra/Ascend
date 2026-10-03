# Phase 7 — Hardening & Android Release

## Firestore security rules (replace the dev rule)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function signedIn() { return request.auth != null; }
    function isOwner(uid) { return signedIn() && request.auth.uid == uid; }

    match /users/{uid} {
      allow read, delete: if isOwner(uid);
      allow create, update: if isOwner(uid)
        && request.resource.data.units in ['kg', 'lb']
        && request.resource.data.name is string
        && request.resource.data.name.size() <= 40;

      match /customExercises/{id} {
        allow read, delete: if isOwner(uid);
        allow create, update: if isOwner(uid)
          && request.resource.data.name is string
          && request.resource.data.name.size() > 0
          && request.resource.data.name.size() <= 50;
      }
      match /workouts/{id}    { allow read, write: if isOwner(uid); }
      match /records/{id}     { allow read, write: if isOwner(uid); }
      match /state/{id}       { allow read, write: if isOwner(uid); }
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```
- Add size/shape checks for workouts if time allows (e.g. `exercises.size() <= 50`).
- Rules + indexes in repo (`firestore.rules`, `firestore.indexes.json`), deployed via Firebase CLI.
- Rules tests with `@firebase/rules-unit-testing` + emulator: owner allowed, other user denied, unauthenticated denied.

## Monitoring
- Add `@react-native-firebase/crashlytics`. Log non-fatal errors from services (auth mapping fallback, failed writes). Opt-out toggle not required for v1 but disclose in privacy policy.
- Root error boundary with "Something went wrong — Restart" screen.

## Firebase / app hardening
- Enable Firebase App Check (Play Integrity) — optional for v1, recommended.
- Auth: enable email enumeration protection in Firebase console.
- Remove all console logs, dev test code, seed scripts from production bundle.
- Separate dev/prod Firebase projects via EAS build profiles + env (if dev project was created).

## Build
- `eas.json` profiles: `development` (dev client), `preview` (internal APK), `production` (AAB, auto-increment `versionCode`).
- App icon (adaptive), splash, monochrome icon — final designs.
- `versionName` starts `1.0.0`.
- Upload keystore managed by EAS; enroll in Play App Signing.

## Play Store
- Google Play developer account (one-time fee).
- New personal accounts must run a **closed test with a minimum number of testers for a minimum period** before production access — check current Play Console requirements and plan time for this.
- Store listing: title, short + full description, screenshots (phone, light + dark), feature graphic, category Health & Fitness.
- Privacy policy URL (hosted page): data collected = email, name, workout data; stored in Firebase; crash data via Crashlytics; how to delete.
- Data safety form matches the policy exactly.
- Account deletion URL (from Phase 6).
- Content rating questionnaire, target audience (not directed at children).
- Health apps declaration if Play Console requires it for fitness category.

## Pre-release QA checklist
- [ ] Fresh install → sign up → onboarding → full workout → finish → history → PRs.
- [ ] Airplane mode mid-workout → finish → reconnect → data appears in history on another device.
- [ ] Two devices, same account: history consistent.
- [ ] Unit switch, theme switch, delete account.
- [ ] Android 10 through latest; small screen (5") and large; font scale 1.3.
- [ ] Back gesture behavior on every screen (no returning to finished workout).
- [ ] Rules tests pass; `lint`, `typecheck`, `test` pass.
- [ ] Production build has no dev menu, no test code.
