import { create } from 'zustand';

import type { UserProfile } from '@/types/user';

export type AuthStatus = 'loading' | 'signedOut' | 'signedIn';
export type ProfileStatus = 'idle' | 'loading' | 'ready' | 'missing' | 'error';

interface SessionState {
  authStatus: AuthStatus;
  uid: string | null;
  email: string | null;
  profileStatus: ProfileStatus;
  profile: UserProfile | null;
}

export const useSessionStore = create<SessionState>()(() => ({
  authStatus: 'loading',
  uid: null,
  email: null,
  profileStatus: 'idle',
  profile: null,
}));

export const selectIsOnboarded = (s: SessionState) => s.profile?.onboardedAt != null;

/** For services/hooks that need the signed-in uid. Throws if called while signed out. */
export function requireUid(): string {
  const { uid } = useSessionStore.getState();
  if (!uid) throw new Error('Not signed in');
  return uid;
}
