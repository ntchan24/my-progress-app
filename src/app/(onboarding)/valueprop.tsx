import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";


export default function ValuePropScreen(){
    return (
        <View className="flow">
            <View className="flow__body">
                <Text className="screen__title">Value Proposition</Text>
            </View>

            <View className="flow__body justify-center items-center">
                <Text className="type-display text-text-primary text-center">That was the first step of your journey. How did it feel?</Text>
                <Text className="type-title1 text-text-secondary text-center"></Text>


            </View>

            <View className="flow__footer">
                <Link href="/(onboarding)/profeaturesone" asChild>
                    <Pressable className="btn-primary">
                        <Text className="btn-primary__label">Next</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    )
}
