import { Pressable } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={{ top: 6, bottom: 6 }}
      style={({ pressed }) => ({
        height: 34,
        paddingHorizontal: t.spacing[3],
        borderRadius: t.radius.full,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: selected ? t.colors.primary : t.colors.border,
        backgroundColor: selected
          ? t.colors.primary
          : pressed
            ? t.colors.surfaceAlt
            : t.colors.surface,
      })}
    >
      <Text variant="label" color={selected ? t.colors.onPrimary : t.colors.text}>
        {label}
      </Text>
    </Pressable>
  );
}
