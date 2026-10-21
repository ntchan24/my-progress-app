import { Link } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';

export default function HeroScreen() {
    return (
        <ScrollView className="screen">
            <Link href="/goalexampleinput" asChild>
                <Pressable className="btn-primary active:opacity-80">
                    <Text className="btn-primary__label">Get Started</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}
