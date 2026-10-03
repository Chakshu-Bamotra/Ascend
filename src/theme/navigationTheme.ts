import { DarkTheme, DefaultTheme, type Theme as NavTheme } from 'expo-router';

import type { Theme } from './useTheme';

/** Maps our tokens onto React Navigation's theme so headers/tabs match. */
export function toNavigationTheme(t: Theme): NavTheme {
  const base = t.scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: t.colors.primary,
      background: t.colors.background,
      card: t.colors.surface,
      text: t.colors.text,
      border: t.colors.border,
      notification: t.colors.danger,
    },
  };
}
