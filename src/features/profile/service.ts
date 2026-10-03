import { doc, onSnapshot, serverTimestamp, setDoc } from '@react-native-firebase/firestore';

import { db } from '@/lib/firebase';
import type { ThemePreference, Units } from '@/types/domain';
import type { UserProfile } from '@/types/user';

import { DEFAULT_REST_SECONDS, parseUserProfile } from './parse';

const SCHEMA_VERSION = 1;
const userRef = (uid: string) => doc(db, 'users', uid);

/** Called right after sign-up. Retries once; onboarding self-heals if both attempts fail. */
export async function createUserDoc(uid: string): Promise<void> {
  const data = {
    name: '',
    units: 'kg' as Units,
    themePreference: 'system' as ThemePreference,
    defaultRestSeconds: DEFAULT_REST_SECONDS,
    onboardedAt: null,
    schemaVersion: SCHEMA_VERSION,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  try {
    await setDoc(userRef(uid), data);
  } catch {
    await setDoc(userRef(uid), data).catch((e: unknown) => {
      if (__DEV__) console.warn('createUserDoc failed twice', e);
    });
  }
}

/**
 * Upsert, so it also repairs a user whose doc was never created.
 * Not awaited by the UI: the snapshot listener moves the user on as soon as
 * the local write lands, even offline.
 */
export function completeOnboarding(
  uid: string,
  input: { name: string; units: Units },
  docExists: boolean,
): Promise<void> {
  return setDoc(
    userRef(uid),
    {
      name: input.name.trim(),
      units: input.units,
      onboardedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      schemaVersion: SCHEMA_VERSION,
      ...(docExists
        ? {}
        : {
            themePreference: 'system',
            defaultRestSeconds: DEFAULT_REST_SECONDS,
            createdAt: serverTimestamp(),
          }),
    },
    { merge: true },
  );
}

export type SettingsPatch = Partial<
  Pick<UserProfile, 'units' | 'themePreference' | 'defaultRestSeconds' | 'name'>
>;

export function updateSettings(uid: string, patch: SettingsPatch): Promise<void> {
  return setDoc(userRef(uid), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}

export type ProfileSnapshot =
  | { kind: 'ready'; profile: UserProfile }
  | { kind: 'missing' }
  /** No server answer yet and nothing cached — keep waiting rather than guess. */
  | { kind: 'pending' };

export function subscribeToProfile(
  uid: string,
  onChange: (snap: ProfileSnapshot) => void,
  onError: (error: unknown) => void,
): () => void {
  return onSnapshot(
    userRef(uid),
    { includeMetadataChanges: true },
    (snap) => {
      if (snap.exists()) {
        // 'estimate' so a pending serverTimestamp (onboardedAt) isn't read as null offline.
        const data = snap.data({ serverTimestamps: 'estimate' }) ?? {};
        onChange({ kind: 'ready', profile: parseUserProfile(data) });
      } else if (snap.metadata.fromCache) {
        onChange({ kind: 'pending' });
      } else {
        onChange({ kind: 'missing' });
      }
    },
    onError,
  );
}
