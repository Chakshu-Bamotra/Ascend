import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Input, Screen, Text } from '@/components/ui';
import { useTheme } from '@/theme';

import { AuthHeader } from './AuthHeader';
import { mapAuthError } from './errors';
import { FormError } from './FormError';
import { sendPasswordReset } from './service';
import { validateEmail } from './validation';

export function ForgotPasswordScreen() {
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    const emailError = validateEmail(email);
    setError(emailError);
    setFormError(null);
    if (emailError) return;

    setSubmitting(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (e) {
      setFormError(mapAuthError(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <Screen scroll>
        <AuthHeader title="Check your email" />
        <View style={{ gap: t.spacing[6] }}>
          <Text muted>
            {`If an account exists for ${email.trim()}, you'll get a link to reset your password. Check your spam folder if it doesn't arrive in a few minutes.`}
          </Text>
          <Button title="Back to sign in" onPress={() => router.back()} fullWidth />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AuthHeader title="Reset password" subtitle="We'll email you a reset link." />
      <View style={{ gap: t.spacing[4] }}>
        <FormError message={formError} />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={error}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="send"
          onSubmitEditing={submit}
          autoFocus
        />
        <Button title="Send reset link" onPress={submit} loading={submitting} fullWidth />
        <Button title="Back" variant="ghost" onPress={() => router.back()} fullWidth />
      </View>
    </Screen>
  );
}
