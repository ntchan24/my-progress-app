import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ProFeaturesOneScreen(){
    return (
        <View className="flow">
            <View className="flow__body">
                <Text className="screen__title">Pro members get unlimited photos and videos</Text>
            </View>

            <View className="flow__footer">
                <Link href="/(onboarding)/profeaturestwo" asChild>
                    <Pressable className="btn-primary">
                        <Text className="btn-primary__label">Next</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    )
}
