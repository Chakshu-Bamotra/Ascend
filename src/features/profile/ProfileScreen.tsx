import Constants from 'expo-constants';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, ConfirmDialog, Screen, SegmentedControl, Text } from '@/components/ui';
import { signOut } from '@/features/auth/service';
import { requireUid, useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTheme } from '@/theme';
import type { ThemePreference, Units } from '@/types/domain';

import { FirebaseStatus } from './FirebaseStatus';
import { updateSettings, type SettingsPatch } from './service';

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const unitOptions: { value: Units; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
];

/** Apply locally first (instant), then persist. Listener reconciles if the write fails. */
function save(patch: SettingsPatch) {
  updateSettings(requireUid(), patch).catch((e: unknown) => {
    if (__DEV__) console.warn('updateSettings failed', e);
  });
}

export function ProfileScreen() {
  const t = useTheme();
  const name = useSessionStore((s) => s.profile?.name ?? '');
  const email = useSessionStore((s) => s.email ?? '');
  const { themePreference, setThemePreference, units, setUnits } = useSettingsStore();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const doSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      setConfirmSignOut(false);
    }
  };

  return (
    <Screen scroll>
      <View style={{ gap: t.spacing[1], marginBottom: t.spacing[6] }}>
        <Text variant="title">{name || 'Profile'}</Text>
        <Text muted>{email}</Text>
      </View>

      <View style={{ gap: t.spacing[4] }}>
        <Card style={{ gap: t.spacing[3] }}>
          <Text variant="label" muted>
            Weight units
          </Text>
          <SegmentedControl
            options={unitOptions}
            value={units}
            accessibilityLabel="Weight units"
            onChange={(v) => {
              setUnits(v);
              save({ units: v });
            }}
          />
          <Text variant="label" muted style={{ marginTop: t.spacing[2] }}>
            Theme
          </Text>
          <SegmentedControl
            options={themeOptions}
            value={themePreference}
            accessibilityLabel="Theme"
            onChange={(v) => {
              setThemePreference(v);
              save({ themePreference: v });
            }}
          />
        </Card>

        <Card style={{ gap: t.spacing[1] }}>
          <Text variant="label" muted>
            App version
          </Text>
          <Text>{Constants.expoConfig?.version ?? '—'}</Text>
          {__DEV__ ? <FirebaseStatus /> : null}
        </Card>

        <Button
          title="Sign out"
          variant="secondary"
          icon="log-out-outline"
          onPress={() => setConfirmSignOut(true)}
          fullWidth
        />
      </View>

      <ConfirmDialog
        visible={confirmSignOut}
        title="Sign out?"
        message="Your workouts stay saved to your account."
        confirmLabel="Sign out"
        loading={signingOut}
        onConfirm={doSignOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    </Screen>
  );
}
