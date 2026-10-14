import { colors, globalStyles } from "@/styles/global";
import { Link } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native-gesture-handler";


export default function science (){
    return (
        <ScrollView style={globalStyles.container}>

            <Text style = {globalStyles.title}>Value Proposition</Text>

            <Link href="/(onboarding)/profeaturesone" asChild>
            <TouchableOpacity style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' }}>
                                <Text style={{ color: colors.background, fontSize: 18, fontWeight: '600' }}>Get Started</Text>
                            </TouchableOpacity>
                            </Link>
        </ScrollView>
    )
}