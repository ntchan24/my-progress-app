import MediaThumbnails from '@/components/MediaThumbnails';
import { colors } from '@/constants/colors';
import { PLAN_LIMITS } from '@/constants/plans';
import { usePlan } from '@/hooks/usePlan';
import { addAchievement, deleteAchievement, MediaItem } from '@/storage/achievements';
import { useOnboardingStore } from '@/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";


export default function AddPhotosScreen(){
    const { goal, win } = useLocalSearchParams<{ goal: string; win: string }>();
    const router = useRouter();
    const firstPost = useOnboardingStore((state) => state.firstPost);
    const setFirstPost = useOnboardingStore((state) => state.setFirstPost);

    const [media, setMedia] = useState<MediaItem[]>([]);
    const [saving, setSaving] = useState(false);
    const { limits } = usePlan();

    const handleContinue = async () => {
        setSaving(true);
        try {
            // If the user came back from showmockup, replace the earlier post instead of duplicating it
            if (firstPost) {
                await deleteAchievement(firstPost.id);
            }

            const post = await addAchievement({
                name: win,
                caption: goal,
                media: media.length > 0 ? media : undefined,
            });

            setFirstPost(post);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push('/showmockup');
        } catch {
            Alert.alert('Something went wrong', "We couldn't save your post. Please try again.");
        } finally {
            setSaving(false);
        }
    };

const pickFromLibrary = async () => {
    // No paywall mid-onboarding: the Pro pitch comes a few screens later
    if (media.length >= limits.maxMediaPerPost) {
      Alert.alert('One photo for now', `Pro lets you add up to ${PLAN_LIMITS.pro.maxMediaPerPost} photos and videos per post.`);
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Please allow access to your media library.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: limits.allowVideo ? ['images', 'videos'] : ['images'],
      allowsMultipleSelection: true,
      quality: 1,
      videoMaxDuration: 60,
      selectionLimit: limits.maxMediaPerPost - media.length, // Limit based on current count
    });

    if (!result.canceled && result.assets.length > 0) {
      const newMedia: MediaItem[] = result.assets
        .map((asset): MediaItem => ({
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
        }))
        // Some Android pickers ignore mediaTypes, so drop videos the plan doesn't allow
        .filter((item) => limits.allowVideo || item.type !== 'video');

      // Some Android versions ignore selectionLimit, so trim anything over the limit
      const room = limits.maxMediaPerPost - media.length;
      setMedia([...media, ...newMedia.slice(0, room)]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (newMedia.length > room) {
        Alert.alert('One photo for now', `Pro lets you add up to ${PLAN_LIMITS.pro.maxMediaPerPost} photos and videos per post.`);
      }
    }
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

    return (
        <View className="flow">
            <ScrollView className="flex-1" contentContainerStyle={{ gap: 12 }}>
                <Text className="screen__title">Add photos to your post</Text>
                <Text className="type-subhead text-text-secondary">{"Don't worry, everything stays on your device and is never shared with us."}</Text>

                {/* Preview of the goal and win passed via route params */}
                <View className="card mt-5 gap-1">
                    <Text className="type-title3 text-text-primary">{win}</Text>
                    <Text className="type-subhead text-text-secondary">{goal}</Text>
                </View>

                <Pressable onPress={pickFromLibrary} className="btn-tonal mt-2">
                    <Ionicons name="images-outline" size={20} color={colors.textPrimary} />
                    <Text className="btn-tonal__label">Choose from Library</Text>
                </Pressable>

                <MediaThumbnails media={media} maxMedia={limits.maxMediaPerPost} onRemove={removeMedia} />
            </ScrollView>

            <View className="flow__footer pt-4">
                <Pressable
                    onPress={handleContinue}
                    disabled={saving}
                    className={`btn-primary ${saving ? 'btn--disabled' : ''}`}
                >
                    <Text className="btn-primary__label">Continue</Text>
                </Pressable>
            </View>
        </View>
    )
}
