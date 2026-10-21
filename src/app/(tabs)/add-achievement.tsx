import { MAX_MEDIA_PER_POST } from '@/constants/media';
import MediaThumbnails from '@/components/MediaThumbnails';
import { addAchievement, MediaItem } from '@/storage/achievements';
import { colors, globalStyles } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
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
    <ScrollView style={globalStyles.container}>
      <Text style={[globalStyles.title, styles.title]}>Add Achievement</Text>

      <View style={styles.mediaButtonsRow}>
        <TouchableOpacity
          style={[styles.mediaButton, styles.halfButton]}
          onPress={handleCameraPress}
        >
          <Ionicons name='camera-outline' size={24} color={colors.primary} />
          <Text style={styles.mediaButtonText}>Take Photo/Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mediaButton, styles.halfButton]}
          onPress={pickFromLibrary}
        >
          <Ionicons name='images-outline' size={24} color={colors.primary} />
          <Text style={styles.mediaButtonText}>Choose from Library</Text>
        </TouchableOpacity>
      </View>

      <MediaThumbnails media={media} onRemove={removeMedia} />

      <TextInput
        style={styles.input}
        placeholder='Achievement name'
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, styles.captionInput]}
        placeholder='Add a caption or note (optional)'
        placeholderTextColor={colors.textSecondary}
        value={caption}
        onChangeText={setCaption}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddAchievement}>
        <Text style={styles.buttonText}>Add Achievement</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Leaves room for the floating menu button in the top-left corner
  title: {
    marginLeft: 52,
  },
  mediaButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  mediaButton: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  halfButton: {
    flex: 1,
  },
  mediaButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 16,
  },
  captionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
