export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 999,
} as const;

/**
 * Barlow for body/UI, Barlow Condensed for titles and numbers.
 * Condensed numerals keep weight × reps columns tight and readable.
 */
export const fontFamily = {
  regular: 'Barlow_400Regular',
  medium: 'Barlow_500Medium',
  semibold: 'Barlow_600SemiBold',
  display: 'BarlowCondensed_600SemiBold',
  displayBold: 'BarlowCondensed_700Bold',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 36,
} as const;

export const touchTarget = 44;
