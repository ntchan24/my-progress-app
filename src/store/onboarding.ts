import { Achievement } from '@/storage/achievements';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OnboardingState = {
    hasCompletedOnboarding: boolean;
    // The post saved during onboarding, kept in memory so showmockup can display it
    firstPost: Achievement | null;
    completeOnboarding: () => void;
    resetOnboarding: () => void;
    setFirstPost: (post: Achievement | null) => void;
}
//flag

export const useOnboardingStore = create<OnboardingState>()(
    // persist middleware saves flag to asyncStorage
    persist(
        (set) => ({
            hasCompletedOnboarding:false,
            firstPost: null,
            completeOnboarding : () => set({hasCompletedOnboarding:true}),
            resetOnboarding: () => set({ hasCompletedOnboarding: false, firstPost: null }),
            setFirstPost: (post) => set({ firstPost: post }),
        }),
        {
            name: 'onboarding',
            storage: createJSONStorage(()=> AsyncStorage),
            // Only the flag needs to survive app restarts
            partialize: (state) => ({ hasCompletedOnboarding: state.hasCompletedOnboarding }),
        }
    )
)
