import { View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/theme';

export function AuthHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const t = useTheme();
  return (
    <View style={{ gap: t.spacing[2], marginTop: t.spacing[10], marginBottom: t.spacing[8] }}>
      <Text variant="caption" color={t.colors.primary} style={{ letterSpacing: 2 }}>
        ASCEND
      </Text>
      <Text variant="display">{title}</Text>
      {subtitle ? <Text muted>{subtitle}</Text> : null}
    </View>
  );
}
