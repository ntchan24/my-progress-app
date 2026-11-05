import Paywall from '@/components/Paywall';
import { useOnboardingStore } from '@/store/onboarding';

// Last onboarding step. Closing or purchasing sets the onboarding flag; the root layout's guard then switches to the tabs.
export default function OnboardingPaywallScreen() {
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  return <Paywall onClose={completeOnboarding} onPurchased={completeOnboarding} />;
}
