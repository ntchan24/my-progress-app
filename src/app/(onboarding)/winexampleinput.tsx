import { colors } from '@/styles/global';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

// Read the goal from the previous screen, take a win, and pass both on to the add photos screen
export default function WinExampleInputScreen() {
    const { goal } = useLocalSearchParams<{ goal: string }>();
    const [win, setWin] = useState('');
    const router = useRouter();

    const goToAddPhotosScreen = () => {
        router.push({ pathname: '/addphotos', params: { goal, win } });
    };

    return (
        <View className="screen">
            <Text className="screen__title">{goal}</Text>

            <TextInput
                className="screen__input"
                onChangeText={setWin}
                value={win}
                placeholder="Enter a win"
                placeholderTextColor={colors.textSecondary}
            />

            <Pressable className="btn-primary mt-6 active:opacity-80" onPress={goToAddPhotosScreen}>
                <Text className="btn-primary__label">Submit</Text>
            </Pressable>
        </View>
    );
}
