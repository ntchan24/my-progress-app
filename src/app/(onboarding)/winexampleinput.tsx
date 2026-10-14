import { colors, globalStyles } from '@/styles/global';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// Read the goal from the previous screen, take a win, and pass both on to the add photos screen
export default function WinExampleInputScreen() {
    const { goal } = useLocalSearchParams<{ goal: string }>();
    const [win, setWin] = useState('');
    const router = useRouter();

    const goToAddPhotosScreen = () => {
        router.push({ pathname: '/addphotos', params: { goal, win } });
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>{goal}</Text>

            <TextInput
                style={globalStyles.input}
                onChangeText={setWin}
                value={win}
                placeholder="Enter a win"
                placeholderTextColor={colors.textSecondary}
            />

            <TouchableOpacity
                style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 }}
                onPress={goToAddPhotosScreen}
            >
                <Text style={{ color: colors.background, fontSize: 18, fontWeight: '600' }}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
}
