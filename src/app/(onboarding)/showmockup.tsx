import MediaCarousel from '@/components/MediaCarousel';
import { useOnboardingStore } from '@/store/onboarding';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function ShowMockupScreen() {
    const firstPost = useOnboardingStore((state) => state.firstPost);

    return (
        <View className="screen">
            <Text className="screen__title">Good work! You just created your first post!</Text>

            {/* Preview of the post saved on the addphotos screen.
                Full-bleed (cancels the screen's 20px padding) because MediaCarousel pages are screen-width */}
            {firstPost?.media && firstPost.media.length > 0 && (
                <View className="h-[480px] -mx-5 my-4 overflow-hidden">
                    <MediaCarousel media={firstPost.media} isActive />
                </View>
            )}

            <Text className="screen__title">{firstPost?.name}</Text>
            <Text className="screen__subtitle">{firstPost?.caption}</Text>

            <Link href="/valueprop" asChild>
                <Pressable className="btn-primary active:opacity-80">
                    <Text className="btn-primary__label">Take the next step</Text>
                </Pressable>
            </Link>
        </View>
    );
}
