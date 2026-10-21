import { MAX_MEDIA_PER_POST } from '@/constants/media';
import MediaThumbnails from '@/components/MediaThumbnails';
import { addAchievement, MediaItem } from '@/storage/achievements';
import { colors } from '@/constants/colors';
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

  const takePhoto = async () => {
    if (media.length >= MAX_MEDIA_PER_POST) {
      Alert.alert('Limit Reached', `You can only add up to ${MAX_MEDIA_PER_POST} media items.`);
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
      setMedia([...media, { uri: asset.uri, type: 'image' }]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Ask if user wants to add more
      Alert.alert(
        'Photo Added',
        'Would you like to add another photo?',
        [
          { text: 'Done', style: 'cancel' },
          { text: 'Add Another', onPress: takePhoto },
        ]
      );
    }
  };

  const recordVideo = async () => {
    if (media.length >= MAX_MEDIA_PER_POST) {
      Alert.alert('Limit Reached', `You can only add up to ${MAX_MEDIA_PER_POST} media items.`);
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
      setMedia([...media, { uri: asset.uri, type: 'video' }]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Ask if user wants to add more
      Alert.alert(
        'Video Added',
        'Would you like to add another video?',
        [
          { text: 'Done', style: 'cancel' },
          { text: 'Add Another', onPress: recordVideo },
        ]
      );
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

      const totalCount = media.length + newMedia.length;
      if (totalCount > MAX_MEDIA_PER_POST) {
        Alert.alert('Limit Reached', `You can only add up to ${MAX_MEDIA_PER_POST} media items total.`);
        return;
      }

      setMedia([...media, ...newMedia]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleCameraPress = () => {
    Alert.alert(
      'Capture Media',
      'What would you like to do?',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Record Video',
          onPress: recordVideo,
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

      <MediaThumbnails media={media} onRemove={removeMedia} />

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
