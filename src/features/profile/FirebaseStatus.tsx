import { getApp } from '@react-native-firebase/app';
import { useMemo } from 'react';

import { Text } from '@/components/ui';
import { useTheme } from '@/theme';

/** Dev-only check that google-services.json was picked up by the native build. */
export function FirebaseStatus() {
  const t = useTheme();
  const status = useMemo(() => {
    try {
      return { ok: true, text: `Firebase: ${getApp().options.projectId}` };
    } catch (e) {
      return { ok: false, text: `Firebase not configured: ${(e as Error).message}` };
    }
  }, []);

  return (
    <Text variant="caption" color={status.ok ? t.colors.success : t.colors.danger}>
      {status.text}
    </Text>
  );
}
