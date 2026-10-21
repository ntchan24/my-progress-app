import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ProFeaturesTwoScreen(){
    return (
        <View className="flow">
            <View className="flow__body">
                <Text className="screen__title">Pro members get cloud storage, widgets, and reminders.</Text>
            </View>

            <View className="flow__footer">
                <Link href="/(onboarding)/paywall" asChild>
                    <Pressable className="btn-primary">
                        <Text className="btn-primary__label">Next</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    )
}
