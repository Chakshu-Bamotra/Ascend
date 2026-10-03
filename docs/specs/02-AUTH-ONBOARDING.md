# Phase 2 — Auth & Onboarding

Goal: real email/password accounts, a correct auth gate, and a 1-screen onboarding.

## Auth service (`features/auth/service.ts`)
- `signUp(email, password)`, `signIn(email, password)`, `sendPasswordReset(email)`, `signOut()`.
- Map Firebase error codes to friendly messages (`auth/invalid-credential`, `auth/email-already-in-use`, `auth/weak-password`, `auth/invalid-email`, `auth/too-many-requests`, `auth/network-request-failed`). Unknown → generic message + Crashlytics log later.
- Validation (`features/auth/validation.ts`): email format; password min 8 chars. Same rules on client for both screens.

## Auth state
- `useAuthStore` (Zustand): `{ user: FirebaseUser | null, status: 'loading' | 'signedOut' | 'signedIn' }`, subscribed once via `onAuthStateChanged` in root layout.
- `useUserProfile()` (TanStack Query or Firestore snapshot listener) reads `users/{uid}`.

## Auth gate (root `_layout.tsx`)
- `loading` → splash (keep native splash visible via `expo-splash-screen` until resolved).
- `signedOut` → `(auth)` group.
- `signedIn` + profile missing or `onboardedAt == null` → `(onboarding)`.
- `signedIn` + onboarded → `(tabs)`.
- Use Expo Router's protected routes / redirect pattern for SDK 57 (check docs). No flicker between groups.

## Screens
### Sign in
Email, password (secure toggle), "Sign in" button, "Forgot password?" link, "Create account" link. Button disabled while submitting. Errors inline under the form.

### Sign up
Email, password, confirm password. On success, create `users/{uid}` doc:
```
{ name: '', units: 'kg', themePreference: 'system', defaultRestSeconds: 90,
  onboardedAt: null, schemaVersion: 1, createdAt, updatedAt }
```
Doc creation must not leave a half-created account: if doc write fails, retry once; onboarding also upserts the doc so it self-heals.

### Forgot password
Email field → sends reset. Always shows the same success message (don't reveal whether the account exists).

### Onboarding (single screen)
- Name (required, 1–40 chars, trimmed).
- Units: segmented control `kg` / `lb`.
- "Continue" → sets `name`, `units`, `onboardedAt` (server timestamp), `updatedAt`. Gate moves user to tabs.
- No back button to auth; a small "Sign out" text link instead.

## Keyboard/UX
- Correct `keyboardType`, `autoComplete`, `textContentType`, `autoCapitalize="none"` on email.
- Return key moves to next field; last field submits.

## Acceptance
- [ ] New user: sign up → onboarding → tabs. Kill app → reopens straight into tabs.
- [ ] Existing user on new install: sign in → tabs (skips onboarding).
- [ ] Wrong password, existing email, weak password, no network each show a clear message.
- [ ] Sign-up killed mid-way (doc missing) still recovers via onboarding.
- [ ] Reset email arrives.
- [ ] No auth screen flashes for signed-in users on cold start.
