import MediaThumbnails from '@/components/MediaThumbnails';
import { addAchievement, MediaItem } from '@/storage/achievements';
import { colors } from '@/constants/colors';
import { usePlan } from '@/hooks/usePlan';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function AddAchievementScreen() {
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const { isPro, limits } = usePlan();

  // Free users are invited to upgrade; Pro users have hit the real cap
  const handleLimitReached = () => {
    if (!isPro) {
      router.push('/paywall');
      return;
    }
    Alert.alert('Limit Reached', `You can only add up to ${limits.maxMediaPerPost} media items.`);
  };

  // `current` is passed in by "Add Another" so it sees the item just added
  const takePhoto = async (current: MediaItem[] = media) => {
    if (current.length >= limits.maxMediaPerPost) {
      handleLimitReached();
      return;
    }

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Camera Permission Required',
        'Please allow camera access to take photos and videos.',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const next: MediaItem[] = [...current, { uri: asset.uri, type: 'image' }];
      setMedia(next);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Only offer another photo if there's room for one
      if (next.length >= limits.maxMediaPerPost) return;

      Alert.alert(
        'Photo Added',
        'Would you like to add another photo?',
        [
          { text: 'Done', style: 'cancel' },
          { text: 'Add Another', onPress: () => takePhoto(next) },
        ]
      );
    }
  };

  // `current` is passed in by "Add Another" so it sees the item just added
  const recordVideo = async (current: MediaItem[] = media) => {
    if (!limits.allowVideo) {
      router.push('/paywall');
      return;
    }

    if (current.length >= limits.maxMediaPerPost) {
      handleLimitReached();
      return;
    }

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Camera Permission Required',
        'Please allow camera access to take photos and videos.',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const next: MediaItem[] = [...current, { uri: asset.uri, type: 'video' }];
      setMedia(next);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Only offer another video if there's room for one
      if (next.length >= limits.maxMediaPerPost) return;

      Alert.alert(
        'Video Added',
        'Would you like to add another video?',
        [
          { text: 'Done', style: 'cancel' },
          { text: 'Add Another', onPress: () => recordVideo(next) },
        ]
      );
    }
  };

  const pickFromLibrary = async () => {
    if (media.length >= limits.maxMediaPerPost) {
      handleLimitReached();
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

      // Some Android versions ignore selectionLimit, so keep what fits, then explain
      const room = limits.maxMediaPerPost - media.length;
      setMedia([...media, ...newMedia.slice(0, room)]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (newMedia.length > room) handleLimitReached();
    }
  };

  const handleCameraPress = () => {
    Alert.alert(
      'Capture Media',
      'What would you like to do?',
      [
        {
          text: 'Take Photo',
          onPress: () => takePhoto(),
        },
        {
          text: 'Record Video',
          onPress: () => recordVideo(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAddAchievement = async () => {
    if (!name) {
      Alert.alert('Almost there', 'Give your win a name first.');
      return;
    }

    await addAchievement({
      name,
      caption: caption || undefined,
      media: media.length > 0 ? media : undefined,
    });

    setName('');
    setCaption('');
    setMedia([]);

    Alert.alert('Win saved', 'Nice work. It’s in your feed now.');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/');
  };

  return (
    <ScrollView className='screen'>
      {/* Left margin leaves room for the floating menu button */}
      <Text className='screen__title ml-[52px] mt-1.5'>New win</Text>
      <Text className='screen__subtitle'>Big or small, it counts.</Text>

      <View className='flex-row gap-3 mt-6'>
        <Pressable className='btn-tonal flex-1' onPress={handleCameraPress}>
          <Ionicons name='camera-outline' size={20} color={colors.textPrimary} />
          <Text className='btn-tonal__label'>Camera</Text>
        </Pressable>

        <Pressable className='btn-tonal flex-1' onPress={pickFromLibrary}>
          <Ionicons name='images-outline' size={20} color={colors.textPrimary} />
          <Text className='btn-tonal__label'>Library</Text>
        </Pressable>
      </View>

      <MediaThumbnails media={media} maxMedia={limits.maxMediaPerPost} onRemove={removeMedia} />

      <View className='field'>
        <Text className='field__label'>Name</Text>
        <TextInput
          className='input'
          placeholder='What did you do?'
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.textPrimary}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View className='field'>
        <Text className='field__label'>Note</Text>
        <TextInput
          className='input input--multiline'
          textAlignVertical='top'
          placeholder='How did it feel? (optional)'
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.textPrimary}
          value={caption}
          onChangeText={setCaption}
          multiline
          numberOfLines={3}
        />
      </View>

      <Pressable className='btn-primary mt-8' onPress={handleAddAchievement}>
        <Text className='btn-primary__label'>Save Win</Text>
      </Pressable>

      <View className='h-10' />
    </ScrollView>
  );
}
