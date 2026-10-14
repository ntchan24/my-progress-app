import { useOnboardingStore } from "@/store/onboarding";
import { colors, globalStyles } from "@/styles/global";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export default function PaywallScreen(){
    const completeOnboarding=useOnboardingStore((s) => s.completeOnboarding)

    return (
        <ScrollView style={globalStyles.container}>
        
            <Text style = {globalStyles.title}>paywall</Text>

            {/* pressing skip sets the onboarding flag; the root layout's guard then switches to the tabs */}
            <TouchableOpacity onPress={completeOnboarding} style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' }}>
                <Text style={{ color: colors.background, fontSize: 18, fontWeight: '600' }}>skip</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}