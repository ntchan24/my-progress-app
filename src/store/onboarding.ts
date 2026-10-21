import { Achievement } from '@/storage/achievements';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OnboardingState = {
    hasCompletedOnboarding: boolean;
    // The post saved during onboarding. showmockup displays it, and it's persisted so that if the
    // user quits mid-onboarding and starts over, addphotos replaces it instead of adding a duplicate.
    // Cleared on completion: after that it's a normal feed post and must never be auto-deleted.
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
            completeOnboarding : () => set({hasCompletedOnboarding:true, firstPost: null}),
            resetOnboarding: () => set({ hasCompletedOnboarding: false, firstPost: null }),
            setFirstPost: (post) => set({ firstPost: post }),
        }),
        {
            name: 'onboarding',
            storage: createJSONStorage(()=> AsyncStorage),
            partialize: (state) => ({
                hasCompletedOnboarding: state.hasCompletedOnboarding,
                firstPost: state.firstPost,
            }),
        }
    )
)
