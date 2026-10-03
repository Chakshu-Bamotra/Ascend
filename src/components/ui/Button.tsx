import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme, type Theme } from '@/theme';

import { Spinner } from './Spinner';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: ComponentProps<typeof Ionicons>['name'];
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
}

const heights: Record<Size, number> = { sm: 36, md: 48, lg: 56 };

function colorsFor(t: Theme, variant: Variant, pressed: boolean) {
  const c = t.colors;
  switch (variant) {
    case 'primary':
      return { bg: pressed ? c.primaryPressed : c.primary, fg: c.onPrimary, border: 'transparent' };
    case 'danger':
      return { bg: c.danger, fg: c.onDanger, border: 'transparent' };
    case 'secondary':
      return { bg: pressed ? c.border : c.surfaceAlt, fg: c.text, border: 'transparent' };
    case 'ghost':
    default:
      return { bg: pressed ? c.surfaceAlt : 'transparent', fg: c.primary, border: 'transparent' };
  }
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  accessibilityHint,
}: ButtonProps) {
  const t = useTheme();
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      hitSlop={size === 'sm' ? 4 : 0}
      style={({ pressed }) => {
        const col = colorsFor(t, variant, pressed);
        return [
          styles.base,
          {
            height: heights[size],
            paddingHorizontal: size === 'sm' ? t.spacing[3] : t.spacing[5],
            borderRadius: t.radius.md,
            backgroundColor: col.bg,
            opacity: disabled ? 0.45 : 1,
            alignSelf: fullWidth ? 'stretch' : 'auto',
          },
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const { fg } = colorsFor(t, variant, pressed);
        return loading ? (
          <Spinner color={fg} />
        ) : (
          <View style={styles.row}>
            {icon ? <Ionicons name={icon} size={size === 'sm' ? 16 : 20} color={fg} /> : null}
            <Text variant={size === 'sm' ? 'label' : 'heading'} color={fg} numberOfLines={1}>
              {title}
            </Text>
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
