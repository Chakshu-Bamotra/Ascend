import type { ThemePreference, Units } from './domain';

export interface UserProfile {
  name: string;
  units: Units;
  themePreference: ThemePreference;
  defaultRestSeconds: number;
  /** epoch ms; null until onboarding is completed */
  onboardedAt: number | null;
  createdAt: number | null;
}
