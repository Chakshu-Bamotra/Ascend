import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { type TextInput, View } from 'react-native';

import { Button, Input, Screen } from '@/components/ui';
import { useTheme } from '@/theme';

import { AuthHeader } from './AuthHeader';
import { mapAuthError } from './errors';
import { FormError } from './FormError';
import { signIn } from './service';
import { validateEmail } from './validation';

export function SignInScreen() {
  const t = useTheme();
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const next = {
      email: validateEmail(email),
      password: password ? null : 'Enter your password.',
    };
    setErrors(next);
    setFormError(null);
    if (next.email || next.password) return;

    setSubmitting(true);
    try {
      await signIn(email, password);
      // The root gate navigates once auth state changes.
    } catch (e) {
      setFormError(mapAuthError(e));
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <AuthHeader title="Welcome back" subtitle="Sign in to keep logging." />
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
          password
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <Button
          title="Forgot password?"
          variant="ghost"
          size="sm"
          style={{ alignSelf: 'flex-end' }}
          onPress={() => router.push('/forgot-password')}
        />
        <Button title="Sign in" onPress={submit} loading={submitting} fullWidth />
        <Button
          title="Create an account"
          variant="secondary"
          onPress={() => router.replace('/sign-up')}
          disabled={submitting}
          fullWidth
        />
      </View>
    </Screen>
  );
}
