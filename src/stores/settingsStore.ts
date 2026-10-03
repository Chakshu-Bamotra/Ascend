import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ThemePreference, Units } from '@/types/domain';

/**
 * Device-local copy of display settings so the right theme and units
 * render on cold start, before the user doc loads. Firestore becomes the
 * source of truth once signed in (synced in Phase 6).
 */
interface SettingsState {
  themePreference: ThemePreference;
  units: Units;
  hasHydrated: boolean;
  setThemePreference: (value: ThemePreference) => void;
  setUnits: (value: Units) => void;
  reset: () => void;
}

const defaults: Pick<SettingsState, 'themePreference' | 'units'> = {
  themePreference: 'system',
  units: 'kg',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      hasHydrated: false,
      setThemePreference: (themePreference) => set({ themePreference }),
      setUnits: (units) => set({ units }),
      reset: () => set(defaults),
    }),
    {
      name: 'ascend-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ themePreference, units }) => ({ themePreference, units }),
      onRehydrateStorage: () => () => {
        useSettingsStore.setState({ hasHydrated: true });
      },
    },
  ),
);
