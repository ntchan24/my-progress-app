import MediaCarousel from '@/components/MediaCarousel';
import { useOnboardingStore } from '@/store/onboarding';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function ShowMockupScreen() {
    const firstPost = useOnboardingStore((state) => state.firstPost);

    return (
        <View className="flow">
            <View className="flow__body">
                <Text className="screen__title">nice work.</Text>
                <Text className="type-subhead text-text-secondary">You just created your first post.</Text>

                {/* Preview of the post saved on the addphotos screen.
                    Full-bleed (cancels the 20px padding) because MediaCarousel pages are screen-width */}
                <View className="flex-1 -mx-5 mt-4 overflow-hidden bg-surface">
                    {firstPost?.media && firstPost.media.length > 0 && (
                        <MediaCarousel media={firstPost.media} isActive />
                    )}
                    <View className="absolute left-5 right-5 bottom-6 gap-1" pointerEvents="none">
                        <Text className="type-title2 text-white">{firstPost?.name}</Text>
                        <Text className="type-subhead text-white/80">{firstPost?.caption}</Text>
                    </View>
                </View>
            </View>

            <View className="flow__footer pt-4">
                <Link href="/valueprop" asChild>
                    <Pressable className="btn-primary">
                        <Text className="btn-primary__label">Continue</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}
