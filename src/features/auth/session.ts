import { onAuthStateChanged } from '@react-native-firebase/auth';

import { subscribeToProfile } from '@/features/profile/service';
import { auth } from '@/lib/firebase';
import { queryClient } from '@/lib/queryClient';
import { useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';

/**
 * Single subscription that keeps sessionStore in sync with Firebase Auth
 * and the signed-in user's profile doc. Call once from the root layout.
 */
export function startSession(): () => void {
  let stopProfile: (() => void) | null = null;

  const stopAuth = onAuthStateChanged(auth, (user) => {
    stopProfile?.();
    stopProfile = null;

    if (!user) {
      queryClient.clear();
      useSettingsStore.getState().reset();
      useSessionStore.setState({
        authStatus: 'signedOut',
        uid: null,
        email: null,
        profileStatus: 'idle',
        profile: null,
      });
      return;
    }

    useSessionStore.setState({
      authStatus: 'signedIn',
      uid: user.uid,
      email: user.email,
      profileStatus: 'loading',
      profile: null,
    });

    stopProfile = subscribeToProfile(
      user.uid,
      (snap) => {
        if (snap.kind === 'pending') return;
        if (snap.kind === 'missing') {
          useSessionStore.setState({ profileStatus: 'missing', profile: null });
          return;
        }
        const { profile } = snap;
        useSessionStore.setState({ profileStatus: 'ready', profile });
        // Firestore is the source of truth for display settings once signed in.
        const settings = useSettingsStore.getState();
        if (settings.units !== profile.units) settings.setUnits(profile.units);
        if (settings.themePreference !== profile.themePreference)
          settings.setThemePreference(profile.themePreference);
      },
      (error) => {
        if (__DEV__) console.warn('Profile listener error', error);
        useSessionStore.setState({ profileStatus: 'error' });
      },
    );
  });

  return () => {
    stopProfile?.();
    stopAuth();
  };
}
