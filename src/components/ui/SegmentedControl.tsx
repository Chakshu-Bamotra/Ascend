import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const t = useTheme();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={{
        flexDirection: 'row',
        backgroundColor: t.colors.surfaceAlt,
        borderRadius: t.radius.md,
        padding: 3,
      }}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={o.label}
            style={{
              flex: 1,
              minHeight: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: t.radius.md - 2,
              backgroundColor: selected ? t.colors.surface : 'transparent',
              borderWidth: selected ? 1 : 0,
              borderColor: t.colors.border,
            }}
          >
            <Text variant="label" color={selected ? t.colors.text : t.colors.textMuted}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
