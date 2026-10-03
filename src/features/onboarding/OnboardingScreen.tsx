import { useState } from 'react';
import { View } from 'react-native';

import { Button, Input, Screen, SegmentedControl, Text } from '@/components/ui';
import { AuthHeader } from '@/features/auth/AuthHeader';
import { FormError } from '@/features/auth/FormError';
import { signOut } from '@/features/auth/service';
import { validateName } from '@/features/auth/validation';
import { completeOnboarding } from '@/features/profile/service';
import { requireUid, useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTheme } from '@/theme';
import type { Units } from '@/types/domain';

const unitOptions: { value: Units; label: string }[] = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'lb', label: 'Pounds (lb)' },
];

export function OnboardingScreen() {
  const t = useTheme();
  const docExists = useSessionStore((s) => s.profileStatus === 'ready');
  const [name, setName] = useState('');
  const [units, setUnits] = useState<Units>(useSettingsStore.getState().units);
  const [nameError, setNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    const err = validateName(name);
    setNameError(err);
    if (err) return;

    setSubmitting(true);
    setFormError(null);
    useSettingsStore.getState().setUnits(units);
    // Not awaited: the profile listener sees the local write immediately and the
    // gate moves on, even offline. The promise only settles on server ack.
    completeOnboarding(requireUid(), { name, units }, docExists).catch((e: unknown) => {
      if (__DEV__) console.warn('completeOnboarding failed', e);
      setFormError("Couldn't save your profile. Check your connection and try again.");
      setSubmitting(false);
    });
  };

  return (
    <Screen scroll>
      <AuthHeader title="Let's set you up" subtitle="Two quick things before your first workout." />
      <View style={{ gap: t.spacing[6] }}>
        <FormError message={formError} />
        <Input
          label="Your name"
          value={name}
          onChangeText={setName}
          error={nameError}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="done"
          maxLength={40}
        />
        <View style={{ gap: t.spacing[2] }}>
          <Text variant="label">Weight units</Text>
          <SegmentedControl
            options={unitOptions}
            value={units}
            onChange={setUnits}
            accessibilityLabel="Weight units"
          />
          <Text variant="caption" muted>
            You can change this later in Profile.
          </Text>
        </View>
        <Button title="Continue" onPress={submit} loading={submitting} fullWidth />
        <Button title="Sign out" variant="ghost" size="sm" onPress={() => signOut()} />
      </View>
    </Screen>
  );
}
