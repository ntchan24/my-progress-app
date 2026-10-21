import { Link } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";

export default function ProFeaturesTwoScreen(){
    return (
        <ScrollView className="screen">

            <Text className="screen__title">Pro members get cloud storage, widgets, and reminders. </Text>

            <Link href="/(onboarding)/paywall" asChild>
                <Pressable className="btn-primary active:opacity-80">
                    <Text className="btn-primary__label">Get Started</Text>
                </Pressable>
            </Link>
        </ScrollView>
    )
}
