import { View } from 'react-native';

import { Button, Screen, Spinner, Text } from '@/components/ui';
import { useSessionStore } from '@/stores/sessionStore';
import { useTheme } from '@/theme';

import { signOut } from './service';

/** Shown only if the profile can't load (offline first launch, rules error). */
export function SessionFallback() {
  const t = useTheme();
  const failed = useSessionStore((s) => s.profileStatus === 'error');

  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.spacing[4] }}>
        {failed ? null : <Spinner size="large" />}
        <Text variant="heading" align="center">
          {failed ? "Couldn't load your account" : 'Connecting…'}
        </Text>
        <Text muted align="center">
          {failed
            ? 'Check your connection, then restart the app. If it keeps happening, sign out and back in.'
            : 'Loading your profile. This needs an internet connection the first time.'}
        </Text>
        <Button title="Sign out" variant="secondary" onPress={() => signOut()} />
      </View>
    </Screen>
  );
}
