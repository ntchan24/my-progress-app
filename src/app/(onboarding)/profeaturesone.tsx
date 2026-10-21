import { Link } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";

export default function ProFeaturesOneScreen(){
    return (
        <ScrollView className="screen">

            <Text className="screen__title">Pro members get unlimited photos and videos</Text>

            <Link href="/(onboarding)/profeaturestwo" asChild>
                <Pressable className="btn-primary active:opacity-80">
                    <Text className="btn-primary__label">Get Started</Text>
                </Pressable>
            </Link>
        </ScrollView>
    )
}
