import { colors, globalStyles } from '@/styles/global';
import { Link, useLocalSearchParams } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ShowMockupScreen() {
    const { goal, win } = useLocalSearchParams<{ goal: string; win: string }>();

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Good work! You just created your first post!</Text>


            {/* Display the goal and win passed via route params */}
            <Text style={globalStyles.title}>{goal}</Text>
            <Text style={globalStyles.sectionTitle}>{win}</Text>

            <Link href="/valueprop" asChild>
                            <TouchableOpacity style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' }}>
                                <Text style={{ color: colors.background, fontSize: 18, fontWeight: '600' }}>Take the next step</Text>
                            </TouchableOpacity>
                        </Link>
        </View>
    );
}
