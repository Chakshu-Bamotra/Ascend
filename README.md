# Ascend

Strength-training workout logger. Expo SDK 57 · TypeScript · Expo Router · React Native Firebase.

Specs and roadmap: [`docs/specs/`](docs/specs/00-OVERVIEW.md).

## Requirements

- Node 22 LTS
- Android Studio (SDK + an emulator) or a physical Android device with USB debugging
- JDK 17 (bundled with Android Studio)

## Setup

1. `npm install`
2. Firebase console → create project → **Add Android app** with package `com.ascend.fitness`.
3. Download `google-services.json` into the project root (gitignored).
4. Firebase console → Authentication → enable **Email/Password**.
5. Firebase console → Firestore → create database (production mode), then set dev rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{db}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
6. Build and install the development client (Expo Go will not work — native Firebase):
   ```
   npm run android
   ```
   Or in the cloud: `npx eas-cli@latest build --profile development --platform android`.
7. After the dev client is installed, day-to-day: `npm start`.

Profile tab shows `Firebase: <project-id>` in dev builds when native config is picked up.

## Scripts

| Script            | Does                           |
| ----------------- | ------------------------------ |
| `npm start`       | Metro for the dev client       |
| `npm run android` | Native Android build + install |
| `npm run check`   | Typecheck + lint + tests       |
| `npm run format`  | Prettier                       |

## Structure

```
src/app/         routes (thin)
src/features/    screens + logic per feature
src/components/ui  themed UI kit
src/lib/         firebase, units, time, ids, query client
src/stores/      zustand stores
src/theme/       tokens, palettes, useTheme, makeStyles
docs/specs/      phase specs
```
