import { colors } from '@/constants/colors';
import { usePlan } from '@/hooks/usePlan';
import { addAchievement, deleteAchievement, MediaItem } from '@/storage/achievements';
import { useOnboardingStore } from '@/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";


export default function AddPhotosScreen(){
    const { win } = useLocalSearchParams<{ win: string}>();
    const router = useRouter();
    const firstPost = useOnboardingStore((state) => state.firstPost);
    const setFirstPost = useOnboardingStore((state) => state.setFirstPost);

    const [media, setMedia] = useState<MediaItem[]>([]);
    const [saving, setSaving] = useState(false);
    const { limits } = usePlan();
    // Onboarding posts hold a single photo; picking again replaces it
    const photo = media[0];

    const handleContinue = async () => {
        setSaving(true);
        try {
            // If the user came back from showmockup, replace the earlier post instead of duplicating it
            if (firstPost) {
                await deleteAchievement(firstPost.id);
            }

            const post = await addAchievement({
                name: win,
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
      allowsMultipleSelection: false,
      quality: 1,
      videoMaxDuration: 60,
    });

    const asset = result.canceled ? undefined : result.assets[0];
    if (!asset) return;

    const item: MediaItem = {
      uri: asset.uri,
      type: asset.type === 'video' ? 'video' : 'image',
    };
    // Some Android pickers ignore mediaTypes, so drop videos the plan doesn't allow
    if (item.type === 'video' && !limits.allowVideo) return;

    setMedia([item]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removePhoto = () => {
    setMedia([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

    return (
        <View className="flow">
            <View className="flow__body">
                <Text className="screen__title">Add photos to your post</Text>
                <Text className="type-subhead text-text-secondary">{"Don't worry, everything stays on your device and is never shared with us."}</Text>

                <Pressable onPress={pickFromLibrary} className="btn-tonal mt-2">
                    <Ionicons name="images-outline" size={20} color={colors.textPrimary} />
                    <Text className="btn-tonal__label">{photo ? 'Change Photo' : 'Choose from Library'}</Text>
                </Pressable>

                {/* The photo fills whatever height is left, so the screen never scrolls */}
                {photo && (
                    <View className="flex-1 mt-2">
                        <Image source={{ uri: photo.uri }} style={styles.preview} contentFit="cover" />
                        {photo.type === 'video' && (
                            <View className="absolute inset-0 items-center justify-center">
                                <Ionicons name="play" size={40} color={colors.textPrimary} />
                            </View>
                        )}
                        <Pressable className="overlay-btn top-3 right-3" onPress={removePhoto} accessibilityLabel="Remove photo">
                            <Ionicons name="close" size={20} color={colors.textPrimary} />
                        </Pressable>
                    </View>
                )}
            </View>

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

// expo-image's Image doesn't support className, so it keeps a StyleSheet
const styles = StyleSheet.create({
    preview: {
        flex: 1,
        width: '100%',
        borderRadius: 20,
        backgroundColor: colors.surfaceRaised,
    },
});
