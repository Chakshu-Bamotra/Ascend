import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { type TextInput, View } from 'react-native';

import { Button, Input, Screen } from '@/components/ui';
import { useTheme } from '@/theme';

import { AuthHeader } from './AuthHeader';
import { mapAuthError } from './errors';
import { FormError } from './FormError';
import { signUp } from './service';
import {
  PASSWORD_MIN_LENGTH,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} from './validation';

type Errors = { email?: string | null; password?: string | null; confirm?: string | null };

export function SignUpScreen() {
  const t = useTheme();
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const next: Errors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validatePasswordConfirm(password, confirm),
    };
    setErrors(next);
    setFormError(null);
    if (next.email || next.password || next.confirm) return;

    setSubmitting(true);
    try {
      await signUp(email, password);
    } catch (e) {
      setFormError(mapAuthError(e));
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <AuthHeader title="Create account" subtitle="Track every set. Catch every PR." />
      <View style={{ gap: t.spacing[4] }}>
        <FormError message={formError} />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          submitBehavior="submit"
        />
        <Input
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          hint={`At least ${PASSWORD_MIN_LENGTH} characters`}
          password
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          submitBehavior="submit"
        />
        <Input
          ref={confirmRef}
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          error={errors.confirm}
          password
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <Button title="Create account" onPress={submit} loading={submitting} fullWidth />
        <Button
          title="I already have an account"
          variant="secondary"
          onPress={() => router.replace('/sign-in')}
          disabled={submitting}
          fullWidth
        />
      </View>
    </Screen>
  );
}
