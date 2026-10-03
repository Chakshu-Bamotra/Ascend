# Phase 6 — Profile & Settings

## Profile tab
Header: name (tap to edit), email, member since.

### Settings sections
**Preferences**
- Units: kg / lb (segmented). Updates `users/{uid}.units`; all screens re-render with converted values. Stored kg never changes.
- Theme: System / Light / Dark. Persist in Firestore and locally (AsyncStorage or MMKV) so the correct theme shows before auth resolves on cold start.
- Default rest timer: picker 30s–5m, 15s steps.

**Library**
- My custom exercises → list with edit/delete (reuses Phase 3).

**Account**
- Change password (requires re-auth with current password).
- Sign out (confirm if an active workout exists — it stays saved in Firestore and resumes after next sign-in).
- Delete account (see below).

**About**
- App version (`expo-application`), privacy policy link, contact/support email, open-source licenses (optional).

## Delete account (Play Store requirement)
1. Confirm dialog explaining all data is permanently deleted.
2. Re-authenticate with password.
3. Delete all user data: `workouts`, `customExercises`, `records`, `state/*`, then `users/{uid}`.
   - Client-side batched deletes in chunks of ≤ 500 is acceptable for v1.
   - Better (optional): Firebase "Delete User Data" extension or a Cloud Function on `auth.user().onDelete` — needs Blaze plan. Decide before release.
4. Delete the Auth user.
5. Return to sign-in.
Also provide a web page (can be simple static page) explaining how to request deletion — Play Console asks for a URL.

## Local persistence
- Small local store for: theme preference, units (for instant first paint), last-signed-in hint. Cleared on sign out.

## Acceptance
- [ ] Unit switch converts every weight on every screen (home, active workout, summary, history, PRs).
- [ ] Theme override survives cold start with no flash.
- [ ] Delete account leaves zero docs under `users/{uid}` and removes the auth user.
- [ ] Change password works; wrong current password shows a clear error.
