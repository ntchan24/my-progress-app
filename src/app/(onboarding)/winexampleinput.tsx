import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

// Take a win from the user and pass it on to the add photos screen
export default function WinExampleInputScreen() {
    const [win, setWin] = useState('');
    const router = useRouter();
    // Blank wins would save an untitled post, so wait for real text
    const canSubmit = win.trim().length > 0;

    const goToAddPhotosScreen = () => {
        router.push({ pathname: '/addphotos', params: { win: win.trim() } });
    };

    return (
        <View className="flow">
            <View className="flow__body">
                <TextInput
                    className="screen__input"
                    onChangeText={setWin}
                    value={win}
                    placeholder="What's something you did this week to progress towards a goal? It could be anything."
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
