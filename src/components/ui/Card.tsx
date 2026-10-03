import type { ReactNode } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Card({ children, onPress, style, accessibilityLabel }: CardProps) {
  const t = useTheme();
  const base: ViewStyle = {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
    padding: t.spacing[4],
  };

  if (!onPress) return <View style={[base, style]}>{children}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [base, pressed && { backgroundColor: t.colors.surfaceAlt }, style]}
    >
      {children}
    </Pressable>
  );
}
