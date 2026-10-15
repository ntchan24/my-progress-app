import { colors, globalStyles } from '@/styles/global';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

// Paywall opened from Settings after onboarding.
// TODO: when the real paywall design lands, share its body with (onboarding)/paywall.tsx
export default function PaywallScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>paywall</Text>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 }}
      >
        <Text style={{ color: colors.background, fontSize: 18, fontWeight: '600' }}>Maybe later</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
