import { colors, globalStyles } from "@/styles/global";
import { Link } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export default function paywall (){
    return (
        <ScrollView style={globalStyles.container}>
        
            <Text style = {globalStyles.title}>paywall</Text>

            <Link href="/" replace asChild>
            <TouchableOpacity style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' }}>
                                <Text style={{ color: colors.background, fontSize: 18, fontWeight: '600' }}>Get Started</Text>
                            </TouchableOpacity>
                            </Link>
        </ScrollView>
    )
}