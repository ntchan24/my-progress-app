import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

// Paywall opened from Settings after onboarding.
// TODO: when the real paywall design lands, share its body with (onboarding)/paywall.tsx
export default function PaywallScreen() {
  return (
    <ScrollView className='screen'>
      <Text className='screen__title'>paywall</Text>

      <TouchableOpacity onPress={() => router.back()} className='btn-primary mt-6'>
        <Text className='btn-primary__label'>Maybe later</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
