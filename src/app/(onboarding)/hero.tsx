import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HeroScreen() {
    return (
        <View className="flow">
            <View className="flow__body justify-center items-center">
                {/* <Text className="type-display text-text-primary text-center">appname.</Text> */}
                <Text className="type-title1 text-text-secondary text-center">Be who you want to be.</Text>
                <Text className="type-title3 text-text-secondary text-center">Create evidence for your new identity with appname</Text>

            </View>

            <View className="flow__footer">
                <Link href="/explanation" asChild>
                    <Pressable className="btn-primary">
                        <Text className="btn-primary__label">Get Started</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}
