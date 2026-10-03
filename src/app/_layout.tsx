import { Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold } from '@expo-google-fonts/barlow';
import {
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
} from '@expo-google-fonts/barlow-condensed';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useMemo, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionFallback } from '@/features/auth/SessionFallback';
import { startSession } from '@/features/auth/session';
import { queryClient } from '@/lib/queryClient';
import { selectIsOnboarded, useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTheme } from '@/theme';
import { toNavigationTheme } from '@/theme/navigationTheme';

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

/** Don't hold the native splash longer than this waiting for the network. */
const SPLASH_MAX_MS = 4000;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_600SemiBold,
    BarlowCondensed_600SemiBold,
    BarlowCondensed_700Bold,
  });
  const settingsReady = useSettingsStore((s) => s.hasHydrated);
  const authStatus = useSessionStore((s) => s.authStatus);
  const profileStatus = useSessionStore((s) => s.profileStatus);
  const onboarded = useSessionStore(selectIsOnboarded);
  const theme = useTheme();
  const navTheme = useMemo(() => toNavigationTheme(theme), [theme]);
  const [splashTimedOut, setSplashTimedOut] = useState(false);

  useEffect(() => startSession(), []);

  useEffect(() => {
    const id = setTimeout(() => setSplashTimedOut(true), SPLASH_MAX_MS);
    return () => clearTimeout(id);
  }, []);

  const signedIn = authStatus === 'signedIn';
  const sessionResolved =
    authStatus === 'signedOut' ||
    (signedIn && (profileStatus === 'ready' || profileStatus === 'missing'));
  const assetsReady = (fontsLoaded || fontError !== null) && settingsReady;
  const showApp = assetsReady && sessionResolved;

  // Once the navigator has mounted, keep it mounted: while a fresh sign-in loads the
  // profile, routing stays on the auth screens instead of flashing a loader.
  const [navigatorMounted, setNavigatorMounted] = useState(false);
  if (showApp && !navigatorMounted) setNavigatorMounted(true);
  const routeSignedIn = signedIn && sessionResolved;
  const renderNavigator = profileStatus !== 'error' && (showApp || navigatorMounted);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  useEffect(() => {
    if (assetsReady && (sessionResolved || splashTimedOut || profileStatus === 'error')) {
      SplashScreen.hideAsync();
    }
  }, [assetsReady, sessionResolved, splashTimedOut, profileStatus]);

  if (!assetsReady || authStatus === 'loading') return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={navTheme}>
            <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
            {renderNavigator ? (
              <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                <Stack.Protected guard={!routeSignedIn}>
                  <Stack.Screen name="(auth)" />
                </Stack.Protected>
                <Stack.Protected guard={routeSignedIn && !onboarded}>
                  <Stack.Screen name="(onboarding)" />
                </Stack.Protected>
                <Stack.Protected guard={routeSignedIn && onboarded}>
                  <Stack.Screen name="(tabs)" />
                </Stack.Protected>
              </Stack>
            ) : (
              <SessionFallback />
            )}
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
