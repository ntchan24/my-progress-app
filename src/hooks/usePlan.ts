import { Plan, PLAN_LIMITS } from '@/constants/plans';
import { useSubscriptionStore } from '@/store/subscription';

// The one place screens ask "what can this user do?"
export function usePlan() {
  const isPro = useSubscriptionStore((s) => s.isPro);
  const plan: Plan = isPro ? 'pro' : 'free';
  return { isPro, plan, limits: PLAN_LIMITS[plan] };
}
