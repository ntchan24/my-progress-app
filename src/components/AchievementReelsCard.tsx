import MediaCarousel from '@/components/MediaCarousel';
import { Achievement } from '@/storage/achievements';
import { colors } from '@/styles/global';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type AchievementReelsCardProps = {
  achievement: Achievement;
  isActive: boolean;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AchievementReelsCard({
  achievement,
  isActive,
}: AchievementReelsCardProps) {

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
    <View style={styles.container}>
      {/* Background Media */}
      {achievement.media && achievement.media.length > 0 ? (
        <MediaCarousel media={achievement.media} isActive={isActive} />
      ) : (
        <View style={styles.defaultBackground}>
          <Text style={styles.defaultBackgroundEmoji}>🎉</Text>
        </View>
      )}

      {/* Content Overlay */}
      <View style={styles.content} pointerEvents="none">
        <Text style={styles.achievementName}>{achievement.name}</Text>

        {achievement.caption && <Text style={styles.caption}>{achievement.caption}</Text>}

        <Text style={styles.macros}>
          {achievement.calories} cal • {achievement.protein}g P • {achievement.carbs}g C • {achievement.fat}g F
        </Text>

        <Text style={styles.timestamp}>{formatDate(achievement.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: colors.background,
    position: 'relative',
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
