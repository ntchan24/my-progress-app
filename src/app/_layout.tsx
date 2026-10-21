import '../global.css';
import { initDatabase } from '@/storage/db';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/colors';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  //read saved flag 
  const hasCompletedOnboarding = useOnboardingStore((s) => s.hasCompletedOnboarding)

  //track if the store has finished loading from AsyncStorage
  const [isHydrated, setIsHydrated] = useState(useOnboardingStore.persist.hasHydrated());


  useEffect(() => {
    initDatabase()
      .catch((error) => console.error('Failed to initialize database:', error))
      .finally(() => setIsDbReady(true));
  }, []);

  //notified when loading finishes
  useEffect(()=> useOnboardingStore.persist.onFinishHydration(() => setIsHydrated(true)), [])
  // Wait until tables exist (and any old data is migrated) before screens query them

  if (!isDbReady || !isHydrated) return null 


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Protected guard = {!hasCompletedOnboarding}>
        <Stack.Screen name='(onboarding)' />  
        </Stack.Protected>

        <Stack.Protected guard = {hasCompletedOnboarding}>
        <Stack.Screen name='(tabs)' />
        <Stack.Screen
          name='settings'
          options={{
            headerShown: true,
            title: 'Settings',
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: { fontSize: 17, fontWeight: '600' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name='paywall' options={{ presentation: 'modal' }} />
        </Stack.Protected>

      </Stack>
    </GestureHandlerRootView>
  );
}
