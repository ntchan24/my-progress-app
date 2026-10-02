import { initDatabase } from '@/storage/db';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .catch((error) => console.error('Failed to initialize database:', error))
      .finally(() => setIsDbReady(true));
  }, []);

  // Wait until tables exist (and any old data is migrated) before screens query them
  if (!isDbReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' />
      </Stack>
    </GestureHandlerRootView>
  );
}
