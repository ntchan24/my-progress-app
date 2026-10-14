import { colors, globalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// Take a goal from the user and pass it on to the win input screen
export default function GoalExampleInputScreen() {
    const [goal, setGoal] = useState('');
    const router = useRouter();

    const goToWinExampleInputScreen = () => {
        router.push({ pathname: '/winexampleinput', params: { goal } });
    };

    return (
        <View style={globalStyles.container}>
            <TextInput
                style={globalStyles.input}
                onChangeText={setGoal}
                value={goal}
                placeholder="Enter a goal"
                placeholderTextColor={colors.textSecondary}
            />

            <TouchableOpacity
                style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 }}
                onPress={goToWinExampleInputScreen}
            >
                <Text style={{ color: colors.background, fontSize: 18, fontWeight: '600' }}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
}
