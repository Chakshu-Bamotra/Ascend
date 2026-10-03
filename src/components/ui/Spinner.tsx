import { ActivityIndicator } from 'react-native';

import { useTheme } from '@/theme';

export function Spinner({ size = 'small', color }: { size?: 'small' | 'large'; color?: string }) {
  const t = useTheme();
  return <ActivityIndicator size={size} color={color ?? t.colors.primary} />;
}
