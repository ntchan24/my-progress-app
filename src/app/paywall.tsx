import Paywall from '@/components/Paywall';
import { router } from 'expo-router';

// Paywall opened from Settings or when hitting a Free limit.
export default function PaywallScreen() {
  return <Paywall onClose={() => router.back()} onPurchased={() => router.back()} />;
}
