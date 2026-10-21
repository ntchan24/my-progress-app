import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HeroScreen() {
    return (
        <View className="flow">
            <View className="flow__body justify-center items-center">
                <Text className="type-display text-text-primary text-center">welcome.</Text>
                <Text className="type-subhead text-text-secondary text-center">A quiet place to keep your wins.</Text>
            </View>

            <View className="flow__footer">
                <Link href="/goalexampleinput" asChild>
                    <Pressable className="btn-primary">
                        <Text className="btn-primary__label">Get Started</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}
