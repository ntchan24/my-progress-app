import { colors } from '@/constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

// Read the goal from the previous screen, take a win, and pass both on to the add photos screen
export default function WinExampleInputScreen() {
    const { goal } = useLocalSearchParams<{ goal: string }>();
    const [win, setWin] = useState('');
    const router = useRouter();
    // Blank wins would save an untitled post, so wait for real text
    const canSubmit = win.trim().length > 0;

    const goToAddPhotosScreen = () => {
        router.push({ pathname: '/addphotos', params: { goal, win: win.trim() } });
    };

    return (
        <View className="flow">
            <View className="flow__body">
                <Text className="type-footnote text-text-secondary">{goal}</Text>

                <TextInput
                    className="screen__input"
                    onChangeText={setWin}
                    value={win}
                    placeholder="Enter a win"
                    placeholderTextColor={colors.textTertiary}
                    selectionColor={colors.textPrimary}
                    autoFocus
                />
            </View>

            <View className="flow__footer">
                <Pressable
                    className={`btn-primary ${canSubmit ? '' : 'btn--disabled'}`}
                    onPress={goToAddPhotosScreen}
                    disabled={!canSubmit}
                >
                    <Text className="btn-primary__label">Next</Text>
                </Pressable>
            </View>
        </View>
    );
}
