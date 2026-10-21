import MediaCarousel from '@/components/MediaCarousel';
import { Achievement } from '@/storage/achievements';
import { Ionicons } from '@expo/vector-icons';
import {
  ActionSheetIOS,
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AchievementReelsCardProps = {
  achievement: Achievement;
  isActive: boolean;
  onDelete: (id: string) => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AchievementReelsCard({
  achievement,
  isActive,
  onDelete,
}: AchievementReelsCardProps) {
  const insets = useSafeAreaInsets();

  const confirmDelete = () => {
    Alert.alert('Delete this moment?', "This can't be undone.", [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(achievement.id) },
    ]);
  };

  const handleOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Delete achievement', 'Cancel'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) confirmDelete();
        },
      );
    } else {
      Alert.alert('Achievement options', undefined, [
        { text: 'Delete achievement', style: 'destructive', onPress: confirmDelete },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      if (hours === 0) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return minutes === 0 ? 'Just now' : `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <View className='w-full bg-background relative' style={{ height: SCREEN_HEIGHT }}>
      {/* Background Media */}
      {achievement.media && achievement.media.length > 0 ? (
        <MediaCarousel media={achievement.media} isActive={isActive} />
      ) : (
        <View className='absolute inset-0 bg-surface items-center justify-center'>
          <Text className='text-[120px] opacity-30'>🎉</Text>
        </View>
      )}

      {/* Content Overlay */}
      <View className='absolute bottom-[100px] left-5 right-5' pointerEvents='none'>
        {achievement.name ? (
          <Text className='text-[32px] font-bold text-white mb-2' style={styles.nameShadow}>
            {achievement.name}
          </Text>
        ) : null}

        {achievement.caption && (
          <Text className='text-base text-white mb-3 leading-[22px]' style={styles.captionShadow}>
            {achievement.caption}
          </Text>
        )}

        <Text className='text-xs text-white/70' style={styles.timestampShadow}>
          {formatDate(achievement.createdAt)}
        </Text>
      </View>

      {/* Options Button */}
      <TouchableOpacity
        className='overlay-btn right-4 bg-black/35'
        style={{ top: insets.top + 12 }}
        onPress={handleOptions}
        accessibilityLabel='Achievement options'
      >
        <Ionicons name='ellipsis-horizontal' size={24} color='#fff' />
      </TouchableOpacity>
    </View>
  );
}

// NativeWind doesn't map text shadows, so they stay in StyleSheet
const textShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: { width: 0, height: 1 },
};

const styles = StyleSheet.create({
  nameShadow: { ...textShadow, textShadowRadius: 10 },
  captionShadow: { ...textShadow, textShadowRadius: 8 },
  timestampShadow: { ...textShadow, textShadowRadius: 6 },
});
