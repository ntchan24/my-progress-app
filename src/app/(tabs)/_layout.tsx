import SettingsMenu from '@/components/SettingsMenu';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View className='flex-1'>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.surface,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='home' size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='add-achievement'
          options={{
            title: 'Add Achievement',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='add-circle' size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      {/* Floats over every tab */}
      <SettingsMenu />
    </View>
  );
}
