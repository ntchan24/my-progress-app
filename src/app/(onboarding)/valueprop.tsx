import { Link } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";


export default function ValuePropScreen(){
    return (
        <ScrollView className="screen">

            <Text className="screen__title">Value Proposition</Text>

            <Link href="/(onboarding)/profeaturesone" asChild>
                <Pressable className="btn-primary active:opacity-80">
                    <Text className="btn-primary__label">Get Started</Text>
                </Pressable>
            </Link>
        </ScrollView>
    )
}
