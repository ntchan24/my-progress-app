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
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
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
      Alert.alert('Error', 'Please enter an achievement name.');
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

    Alert.alert('Success', 'Achievement added successfully!');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/');
  };

  return (
    <ScrollView className='screen'>
      {/* Left margin leaves room for the floating menu button */}
      <Text className='screen__title ml-[52px]'>Add Achievement</Text>

      <View className='flex-row gap-2.5 mt-4'>
        <TouchableOpacity
          className='btn-dashed flex-1 mt-0'
          onPress={handleCameraPress}
        >
          <Ionicons name='camera-outline' size={24} color={colors.primary} />
          <Text className='btn-dashed__label'>Take Photo/Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className='btn-dashed flex-1 mt-0'
          onPress={pickFromLibrary}
        >
          <Ionicons name='images-outline' size={24} color={colors.primary} />
          <Text className='btn-dashed__label'>Choose from Library</Text>
        </TouchableOpacity>
      </View>

      <MediaThumbnails media={media} onRemove={removeMedia} />

      <TextInput
        className='input'
        placeholder='Achievement name'
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        className='input min-h-20'
        textAlignVertical='top'
        placeholder='Add a caption or note (optional)'
        placeholderTextColor={colors.textSecondary}
        value={caption}
        onChangeText={setCaption}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity className='btn-primary rounded-[10px] mt-6' onPress={handleAddAchievement}>
        <Text className='text-background text-base font-bold'>Add Achievement</Text>
      </TouchableOpacity>

      <View className='h-10' />
    </ScrollView>
  );
}
