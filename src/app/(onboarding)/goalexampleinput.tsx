import { colors } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

// Take a goal from the user and pass it on to the win input screen
export default function GoalExampleInputScreen() {
    const [goal, setGoal] = useState('');
    const router = useRouter();

    const goToWinExampleInputScreen = () => {
        router.push({ pathname: '/winexampleinput', params: { goal } });
    };

    return (
        <View className="screen">
            <TextInput
                className="screen__input"
                onChangeText={setGoal}
                value={goal}
                placeholder="Enter a goal"
                placeholderTextColor={colors.textSecondary}
            />

            <Pressable className="btn-primary mt-6 active:opacity-80" onPress={goToWinExampleInputScreen}>
                <Text className="btn-primary__label">Submit</Text>
            </Pressable>
        </View>
    );
}
