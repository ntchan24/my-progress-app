import { useOnboardingStore } from "@/store/onboarding";
import { Pressable, Text, View } from "react-native";

export default function PaywallScreen(){
    const completeOnboarding=useOnboardingStore((s) => s.completeOnboarding)

    return (
        <View className="flow">
            <View className="flow__body">
                <Text className="type-display text-text-primary">paywall</Text>
            </View>

            {/* pressing skip sets the onboarding flag; the root layout's guard then switches to the tabs */}
            <View className="flow__footer">
                <Pressable onPress={completeOnboarding} className="btn-text">
                    <Text className="btn-text__label">Skip</Text>
                </Pressable>
            </View>
        </View>
    )
}
