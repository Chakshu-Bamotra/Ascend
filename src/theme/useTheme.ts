import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@/stores/settingsStore';

import { dark, light, type Palette } from './palettes';
import { fontFamily, fontSize, radius, spacing, touchTarget } from './tokens';

export type ColorScheme = 'light' | 'dark';

export interface Theme {
  scheme: ColorScheme;
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  font: { family: typeof fontFamily; size: typeof fontSize };
  touchTarget: number;
}

const build = (scheme: ColorScheme, colors: Palette): Theme => ({
  scheme,
  colors,
  spacing,
  radius,
  font: { family: fontFamily, size: fontSize },
  touchTarget,
});

export const themes: Record<ColorScheme, Theme> = {
  light: build('light', light),
  dark: build('dark', dark),
};

export function useColorSchemeResolved(): ColorScheme {
  const system = useColorScheme();
  const preference = useSettingsStore((s) => s.themePreference);
  if (preference === 'system') return system === 'dark' ? 'dark' : 'light';
  return preference;
}

export function useTheme(): Theme {
  return themes[useColorSchemeResolved()];
}

/**
 * const useStyles = makeStyles((t) => StyleSheet.create({ box: { padding: t.spacing[4] } }));
 * Built once per scheme and cached.
 */
export function makeStyles<T>(factory: (theme: Theme) => T): () => T {
  const cache: Partial<Record<ColorScheme, T>> = {};
  return function useStyles() {
    const theme = useTheme();
    return useMemo(() => {
      const hit = cache[theme.scheme];
      if (hit) return hit;
      const built = factory(theme);
      cache[theme.scheme] = built;
      return built;
    }, [theme]);
  };
}
