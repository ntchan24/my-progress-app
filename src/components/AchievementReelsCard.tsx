import MediaCarousel from '@/components/MediaCarousel';
import { Achievement } from '@/storage/achievements';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import {
  ActionSheetIOS,
  Alert,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
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
      { text: 'Keep It', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(achievement.id) },
    ]);
  };

  const handleOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Delete Win', 'Cancel'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) confirmDelete();
        },
      );
    } else {
      Alert.alert('Options', undefined, [
        { text: 'Delete Win', style: 'destructive', onPress: confirmDelete },
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
    <View className='w-full bg-bg relative' style={{ height: SCREEN_HEIGHT }}>
      {/* Background Media */}
      {achievement.media && achievement.media.length > 0 ? (
        <MediaCarousel media={achievement.media} isActive={isActive} />
      ) : (
        <View className='absolute inset-0 bg-surface items-center justify-center'>
          <View className='size-16 rounded-full bg-surface-raised items-center justify-center'>
            <Ionicons name='trophy-outline' size={24} color={colors.textSecondary} />
          </View>
        </View>
      )}

      {/* Content Overlay */}
      <View className='absolute bottom-[100px] left-5 right-5' pointerEvents='none'>
        {achievement.name ? (
          <Text className='type-title1 text-white mb-2' style={styles.nameShadow}>
            {achievement.name}
          </Text>
        ) : null}

        {achievement.caption && (
          <Text className='type-body text-white mb-3' style={styles.captionShadow}>
            {achievement.caption}
          </Text>
        )}

        <Text className='type-footnote text-white/70' style={styles.timestampShadow}>
          {formatDate(achievement.createdAt)}
        </Text>
      </View>

      {/* Options Button */}
      <Pressable
        className='overlay-btn right-4'
        style={{ top: insets.top + 12 }}
        onPress={handleOptions}
        accessibilityLabel='Achievement options'
      >
        <Ionicons name='ellipsis-horizontal' size={20} color={colors.textPrimary} />
      </Pressable>
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
