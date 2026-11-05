import { colors } from '@/constants/colors';
import { DEFAULT_PLAN_ID, LEGAL_URLS, PAYWALL_FEATURES, PAYWALL_PLANS, PaywallPlanId } from '@/data/paywall';
import { useSubscriptionStore } from '@/store/subscription';
import { useToastStore } from '@/store/toast';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PaywallProps = {
  onClose: () => void;
  onPurchased: () => void;
};

// Shared by the Settings modal and the last onboarding step; the routes decide what close/purchase do.
export default function Paywall({ onClose, onPurchased }: PaywallProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<PaywallPlanId>(DEFAULT_PLAN_ID);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const isPro = useSubscriptionStore((s) => s.isPro);
  const setIsPro = useSubscriptionStore((s) => s.setIsPro);
  const showToast = useToastStore((s) => s.show);

  const selectedPlan = PAYWALL_PLANS.find((plan) => plan.id === selectedPlanId) ?? PAYWALL_PLANS[0];

  const selectPlan = (id: PaywallPlanId) => {
    Haptics.selectionAsync();
    setSelectedPlanId(id);
  };

  // Mock purchase until RevenueCat/StoreKit is added: swap the delay for the real purchase call.
  const startTrial = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPurchasing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsPurchasing(false);
    setIsPro(true);
    onPurchased();
    showToast('Welcome to Premium');
  };

  // Mock restore: only "finds" a purchase if the user is already Pro.
  const restore = () => {
    if (isPro) {
      onPurchased();
    } else {
      Alert.alert('No purchases found');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View className='flex-1 px-5 pb-7'>
        <View className='h-11 flex-row items-center justify-between'>
          <Pressable onPress={restore} hitSlop={12} className='active:opacity-70'>
            <Text className='type-subhead font-semibold text-text-secondary'>Restore</Text>
          </Pressable>
          <Pressable onPress={onClose} hitSlop={12} className='active:opacity-70'>
            <Ionicons name='close' size={22} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Text className='type-overline text-text-tertiary text-center mt-3'>Still Premium</Text>
        <Text className='type-title1 text-text-primary text-center mt-2'>Keep more of every day.</Text>

        <View className='mt-7 mx-2 gap-3.5'>
          {PAYWALL_FEATURES.map((feature) => (
            <View key={feature} className='paywall-feature'>
              <View className='paywall-feature__icon'>
                <Ionicons name='checkmark' size={16} color={colors.textPrimary} />
              </View>
              <Text className='paywall-feature__label'>{feature}</Text>
            </View>
          ))}
        </View>

        <View className='flex-1' />

        <View className='gap-2.5'>
          {PAYWALL_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <Pressable
                key={plan.id}
                onPress={() => selectPlan(plan.id)}
                className={`paywall-plan ${isSelected ? 'paywall-plan--selected' : ''}`}
              >
                <View className={`paywall-plan__radio ${isSelected ? 'paywall-plan__radio--selected' : ''}`}>
                  {isSelected && <View className='paywall-plan__dot' />}
                </View>
                <View className='flex-1'>
                  <Text className='type-headline text-text-primary'>{plan.name}</Text>
                  <Text className='type-footnote text-text-secondary'>{plan.perMonth}</Text>
                </View>
                <Text className='type-headline text-text-primary'>{plan.price}</Text>

                {plan.badge && (
                  <View className='paywall-plan__badge'>
                    <Text className='paywall-plan__badge-label'>{plan.badge}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={startTrial}
          disabled={isPurchasing}
          className={`btn-primary mt-4 ${isPurchasing ? 'btn--disabled' : ''}`}
        >
          {isPurchasing ? (
            <ActivityIndicator color={colors.onInverse} />
          ) : (
            <Text className='btn-primary__label'>Start Free Trial</Text>
          )}
        </Pressable>

        <Text className='type-footnote text-text-secondary text-center mt-2.5'>
          7 days free, then {selectedPlan.billing}. Cancel anytime.
        </Text>

        <View className='flex-row justify-center gap-4 mt-2.5'>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(LEGAL_URLS.terms)} className='active:opacity-70'>
            <Text className='paywall-link'>Terms</Text>
          </Pressable>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(LEGAL_URLS.privacy)} className='active:opacity-70'>
            <Text className='paywall-link'>Privacy</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
