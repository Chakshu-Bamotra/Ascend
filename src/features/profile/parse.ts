import type { ThemePreference, Units } from '@/types/domain';
import type { UserProfile } from '@/types/user';

export const DEFAULT_REST_SECONDS = 90;

type Raw = Record<string, unknown>;

/** Firestore Timestamp | number | null → epoch ms | null */
export function toMillis(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object' && 'toMillis' in value) {
    const fn = (value as { toMillis: unknown }).toMillis;
    if (typeof fn === 'function') return (fn as () => number).call(value);
  }
  return null;
}

const isUnits = (v: unknown): v is Units => v === 'kg' || v === 'lb';
const isTheme = (v: unknown): v is ThemePreference =>
  v === 'system' || v === 'light' || v === 'dark';

/** Validates and fills defaults so bad or old docs never crash the UI. */
export function parseUserProfile(data: Raw): UserProfile {
  const rest = data.defaultRestSeconds;
  return {
    name: typeof data.name === 'string' ? data.name : '',
    units: isUnits(data.units) ? data.units : 'kg',
    themePreference: isTheme(data.themePreference) ? data.themePreference : 'system',
    defaultRestSeconds:
      typeof rest === 'number' && rest >= 15 && rest <= 600 ? rest : DEFAULT_REST_SECONDS,
    onboardedAt: toMillis(data.onboardedAt),
    createdAt: toMillis(data.createdAt),
  };
}
