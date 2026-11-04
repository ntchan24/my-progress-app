import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SubscriptionState = {
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
};

// For now isPro is only flipped by the dev toggle in Settings.
// Once purchases exist (e.g. RevenueCat), they become the source of truth and
// this persisted value is just an offline cache so the app opens with the right plan.
export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      isPro: false,
      setIsPro: (isPro) => set({ isPro }),
    }),
    {
      name: 'subscription',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isPro: state.isPro }),
    }
  )
);
