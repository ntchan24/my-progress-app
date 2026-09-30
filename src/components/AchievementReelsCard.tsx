import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { Achievement, deleteAchievement } from '@/storage/achievements';
import { colors } from '@/styles/global';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type AchievementReelsCardProps = {
  achievement: Achievement;
  isActive: boolean;
  onDelete: () => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AchievementReelsCard({
  achievement,
  isActive,
  onDelete,
}: AchievementReelsCardProps) {
  const player = useVideoPlayback(
    achievement.mediaType === 'video' ? achievement.mediaUri : undefined,
    isActive,
  );

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Delete Achievement', `Are you sure you want to delete "${achievement.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteAchievement(achievement.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onDelete();
        },
      },
    ]);
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
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onLongPress={handleLongPress}
    >
      {/* Background Media */}
      {achievement.mediaUri && achievement.mediaType === 'image' && (
        <Image source={{ uri: achievement.mediaUri }} style={styles.backgroundMedia} />
      )}

      {achievement.mediaUri && achievement.mediaType === 'video' && (
        <VideoView
          style={styles.backgroundMedia}
          player={player}
          nativeControls={false}
          contentFit='cover'
        />
      )}

      {/* Default Background if no media */}
      {!achievement.mediaUri && (
        <View style={styles.defaultBackground}>
          <Text style={styles.defaultBackgroundEmoji}>🎉</Text>
        </View>
      )}



      {/* Content Overlay */}
      <View style={styles.content}>
        <Text style={styles.achievementName}>{achievement.name}</Text>

        {achievement.caption && <Text style={styles.caption}>{achievement.caption}</Text>}

        <Text style={styles.macros}>
          {achievement.calories} cal • {achievement.protein}g P • {achievement.carbs}g C • {achievement.fat}g F
        </Text>

        <Text style={styles.timestamp}>{formatDate(achievement.createdAt)}</Text>

        <Text style={styles.hint}>Long press to delete</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: colors.background,
    position: 'relative',
  },
  backgroundMedia: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  defaultBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultBackgroundEmoji: {
    fontSize: 120,
    opacity: 0.3,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  achievementName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  caption: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  macros: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  hint: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
