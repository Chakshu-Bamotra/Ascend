import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

interface ListItemProps {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  chevron?: boolean;
  destructive?: boolean;
}

export function ListItem({
  title,
  subtitle,
  left,
  right,
  onPress,
  onLongPress,
  chevron = false,
  destructive = false,
}: ListItemProps) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={!onPress && !onLongPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      style={({ pressed }) => [
        styles.row,
        {
          minHeight: 56,
          paddingHorizontal: t.spacing[4],
          gap: t.spacing[3],
          backgroundColor: pressed ? t.colors.surfaceAlt : 'transparent',
        },
      ]}
    >
      {left}
      <View style={styles.body}>
        <Text numberOfLines={1} color={destructive ? t.colors.danger : undefined}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" muted numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
      {chevron ? <Ionicons name="chevron-forward" size={18} color={t.colors.textMuted} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  body: { flex: 1, gap: 2 },
});
