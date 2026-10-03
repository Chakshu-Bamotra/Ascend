import Constants from 'expo-constants';
import { View } from 'react-native';

import { Card, Chip, Screen, Text } from '@/components/ui';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTheme } from '@/theme';
import type { ThemePreference, Units } from '@/types/domain';

import { FirebaseStatus } from './FirebaseStatus';

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const unitOptions: { value: Units; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
];

export function ProfileScreen() {
  const t = useTheme();
  const { themePreference, setThemePreference, units, setUnits } = useSettingsStore();

  return (
    <Screen scroll>
      <Text variant="title" style={{ marginBottom: t.spacing[6] }}>
        Profile
      </Text>

      <View style={{ gap: t.spacing[4] }}>
        <Card style={{ gap: t.spacing[3] }}>
          <Text variant="label" muted>
            Theme
          </Text>
          <View style={{ flexDirection: 'row', gap: t.spacing[2] }}>
            {themeOptions.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                selected={themePreference === o.value}
                onPress={() => setThemePreference(o.value)}
              />
            ))}
          </View>

          <Text variant="label" muted style={{ marginTop: t.spacing[2] }}>
            Units
          </Text>
          <View style={{ flexDirection: 'row', gap: t.spacing[2] }}>
            {unitOptions.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                selected={units === o.value}
                onPress={() => setUnits(o.value)}
              />
            ))}
          </View>
        </Card>

        <Card style={{ gap: t.spacing[1] }}>
          <Text variant="label" muted>
            App version
          </Text>
          <Text>{Constants.expoConfig?.version ?? '—'}</Text>
          {__DEV__ ? <FirebaseStatus /> : null}
        </Card>
      </View>
    </Screen>
  );
}
