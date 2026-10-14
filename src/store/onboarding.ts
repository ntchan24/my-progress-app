import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OnboardingState = {
    hasCompletedOnboarding: boolean;
    completeOnboarding: () => void;
    resetOnboarding: () => void;
}
//flag

export const useOnboardingStore = create<OnboardingState>()(
    // persist middleware saves flag to asyncStorage
    persist(
        (set) => ({
            hasCompletedOnboarding:false,
            completeOnboarding : () => set({hasCompletedOnboarding:true}),
            resetOnboarding: () => set({ hasCompletedOnboarding: false }),
        }),
        {name: 'onboarding', storage: createJSONStorage(()=> AsyncStorage)}
    )
)