import { MAX_MEDIA_PER_POST } from '@/constants/media';
import MediaThumbnails from '@/components/MediaThumbnails';
import { addAchievement, deleteAchievement, MediaItem } from '@/storage/achievements';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text } from "react-native";

export default function AddPhotosScreen(){
    const { goal, win } = useLocalSearchParams<{ goal: string; win: string }>();
    const router = useRouter();
    const firstPost = useOnboardingStore((state) => state.firstPost);
    const setFirstPost = useOnboardingStore((state) => state.setFirstPost);

    const [media, setMedia] = useState<MediaItem[]>([]);
    const [saving, setSaving] = useState(false);

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
    if (media.length >= MAX_MEDIA_PER_POST) {
      Alert.alert('Limit Reached', `You can only add up to ${MAX_MEDIA_PER_POST} media items.`);
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
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 1,
      videoMaxDuration: 60,
      selectionLimit: MAX_MEDIA_PER_POST - media.length, // Limit based on current count
    });

    if (!result.canceled && result.assets.length > 0) {
      const newMedia: MediaItem[] = result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
      }));

      setMedia([...media, ...newMedia]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

    return (
        <ScrollView className="screen">

            <Text className="screen__title">{"Add photos to posts! Don't worry, all data is local only and will not be shared with us."}</Text>

            {/* Display the goal and win passed via route params */}
            <Text className="screen__title">{goal}</Text>
            <Text className="screen__subtitle">{win}</Text>

            <Pressable onPress={pickFromLibrary} className="btn-dashed active:opacity-80">
                <Ionicons name="images-outline" size={24} color={colors.primary} />
                <Text className="btn-dashed__label">Choose from Library</Text>
            </Pressable>

            <MediaThumbnails media={media} onRemove={removeMedia} />

            <Pressable
                onPress={handleContinue}
                disabled={saving}
                className={`btn-primary mt-6 active:opacity-80 ${saving ? 'opacity-60' : ''}`}
            >
                <Text className="btn-primary__label">Get Started</Text>
            </Pressable>

        </ScrollView>
    )
}
