import { View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/theme';

export function FormError({ message }: { message: string | null }) {
  const t = useTheme();
  if (!message) return null;
  return (
    <View
      accessibilityLiveRegion="polite"
      style={{
        borderRadius: t.radius.md,
        borderWidth: 1,
        borderColor: t.colors.danger,
        padding: t.spacing[3],
      }}
    >
      <Text variant="label" color={t.colors.danger}>
        {message}
      </Text>
    </View>
  );
}
