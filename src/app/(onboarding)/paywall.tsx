import { useOnboardingStore } from "@/store/onboarding";
import { Pressable, ScrollView, Text } from "react-native";

export default function PaywallScreen(){
    const completeOnboarding=useOnboardingStore((s) => s.completeOnboarding)

    return (
        <ScrollView className="screen">

            <Text className="screen__title">paywall</Text>

            {/* pressing skip sets the onboarding flag; the root layout's guard then switches to the tabs */}
            <Pressable onPress={completeOnboarding} className="btn-primary active:opacity-80">
                <Text className="btn-primary__label">skip</Text>
            </Pressable>
        </ScrollView>
    )
}
