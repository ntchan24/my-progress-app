import { colors, globalStyles } from "@/styles/global";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";


// should i have an actual take a photo thing here or just a demo of what it looks like to add a photo

export default function addphotos (){
    const { goal, win } = useLocalSearchParams<{ goal: string; win: string }>();
    const router = useRouter();

    const goToAddPhotosScreen = () => {
        router.push({ pathname: '/showmockup', params: { goal, win } });
    };

    return (
        <ScrollView style={globalStyles.container}>
        
            <Text style = {globalStyles.title}>Add photos to posts! Don't worry, all data is local only and will not be shared with us.</Text>

            {/* Display the goal and win passed via route params */}
            <Text style={globalStyles.title}>{goal}</Text>
            <Text style={globalStyles.sectionTitle}>{win}</Text>


            <Link href="/(onboarding)/showmockup" asChild>
            <TouchableOpacity style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' }}>
                                <Text style={{ color: colors.background, fontSize: 18, fontWeight: '600' }}>Get Started</Text>
                            </TouchableOpacity>
                            </Link>
        </ScrollView>
    )
}