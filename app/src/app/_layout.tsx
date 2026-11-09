import '../../global.css';

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/ui';
import { queryClient } from '@/lib/queryClient';
import { loadSession, useSession } from '@/lib/session';
import { useTheme } from '@/theme/useTheme';

void SplashScreen.preventAutoHideAsync();
void loadSession();

export default function RootLayout() {
  const { c, dark } = useTheme();
  const { loaded, token } = useSession();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  // If the fonts fail to load, carry on with the system font rather than a stuck splash screen.
  const ready = loaded && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  // Web (dev self-check only): Tailwind's `dark:` classes need the class on <html>. Native needs nothing.
  useEffect(() => {
    if (Platform.OS === 'web') document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <ToastProvider>
              <StatusBar style={dark ? 'light' : 'dark'} />
              {/* https://docs.expo.dev/router/advanced/protected/ */}
              <Stack
                screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}
              >
                <Stack.Protected guard={!!token} redirectTo="/login">
                  <Stack.Screen name="index" />
                  <Stack.Screen name="settings" />
                </Stack.Protected>
                <Stack.Protected guard={!token}>
                  <Stack.Screen name="login" />
                </Stack.Protected>
                <Stack.Screen name="dev/gallery" />
              </Stack>
            </ToastProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
