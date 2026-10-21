import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

// Take a goal from the user and pass it on to the win input screen
export default function GoalExampleInputScreen() {
    const [goal, setGoal] = useState('');
    const router = useRouter();
    // Blank goals would save a post with an empty caption, so wait for real text
    const canSubmit = goal.trim().length > 0;

    const goToWinExampleInputScreen = () => {
        router.push({ pathname: '/winexampleinput', params: { goal: goal.trim() } });
    };

    return (
        <View className="flow">
            <View className="flow__body">
                <TextInput
                    className="screen__input"
                    onChangeText={setGoal}
                    value={goal}
                    placeholder="Enter a goal"
                    placeholderTextColor={colors.textTertiary}
                    selectionColor={colors.textPrimary}
                    autoFocus
                />
            </View>

            <View className="flow__footer">
                <Pressable
                    className={`btn-primary ${canSubmit ? '' : 'btn--disabled'}`}
                    onPress={goToWinExampleInputScreen}
                    disabled={!canSubmit}
                >
                    <Text className="btn-primary__label">Next</Text>
                </Pressable>
            </View>
        </View>
    );
}
