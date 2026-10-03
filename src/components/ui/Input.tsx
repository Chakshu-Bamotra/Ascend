import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string | null;
  hint?: string;
  /** Adds a show/hide toggle and hides text by default. */
  password?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, password = false, editable = true, onFocus, onBlur, ...rest },
  ref,
) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(password);

  const borderColor = error ? t.colors.danger : focused ? t.colors.primary : t.colors.border;

  return (
    <View style={styles.wrap}>
      {label ? <Text variant="label">{label}</Text> : null}
      <View
        style={[
          styles.field,
          {
            borderColor,
            borderRadius: t.radius.md,
            backgroundColor: editable ? t.colors.surface : t.colors.surfaceAlt,
            minHeight: 48,
          },
        ]}
      >
        <TextInput
          ref={ref}
          editable={editable}
          secureTextEntry={hidden}
          placeholderTextColor={t.colors.textMuted}
          selectionColor={t.colors.primary}
          accessibilityLabel={label}
          maxFontSizeMultiplier={1.4}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              color: t.colors.text,
              fontFamily: t.font.family.regular,
              fontSize: t.font.size.md,
              paddingHorizontal: t.spacing[3],
            },
          ]}
          {...rest}
        />
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            style={styles.toggle}
            hitSlop={8}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={t.colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" color={t.colors.danger} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" muted>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  field: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5 },
  input: { flex: 1, paddingVertical: 12 },
  toggle: { paddingHorizontal: 12, height: 44, justifyContent: 'center' },
});
