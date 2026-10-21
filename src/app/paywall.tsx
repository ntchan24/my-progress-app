import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

// Paywall opened from Settings after onboarding.
// TODO: when the real paywall design lands, share its body with (onboarding)/paywall.tsx
export default function PaywallScreen() {
  return (
    <View className='flow'>
      <View className='flow__body'>
        <Text className='type-display text-text-primary'>paywall</Text>
      </View>

      <View className='flow__footer'>
        <Pressable onPress={() => router.back()} className='btn-text'>
          <Text className='btn-text__label'>Maybe Later</Text>
        </Pressable>
      </View>
    </View>
  );
}
