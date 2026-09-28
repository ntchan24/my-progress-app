import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { deleteMeal, Meal } from '@/storage/meals';
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

type MealReelsCardProps = {
  meal: Meal;
  isActive: boolean;
  onDelete: () => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MealReelsCard({
  meal,
  isActive,
  onDelete,
}: MealReelsCardProps) {
  const player = useVideoPlayback(
    meal.mediaType === 'video' ? meal.mediaUri : undefined,
    isActive,
  );

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Delete Meal', `Are you sure you want to delete "${meal.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMeal(meal.id);
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
      {meal.mediaUri && meal.mediaType === 'image' && (
        <Image source={{ uri: meal.mediaUri }} style={styles.backgroundMedia} />
      )}

      {meal.mediaUri && meal.mediaType === 'video' && (
        <VideoView
          style={styles.backgroundMedia}
          player={player}
          nativeControls={false}
          contentFit='cover'
        />
      )}

      {/* Default Background if no media */}
      {!meal.mediaUri && (
        <View style={styles.defaultBackground}>
          <Text style={styles.defaultBackgroundEmoji}>🍽️</Text>
        </View>
      )}

      {/* Gradient Overlay */}
      <View style={styles.gradient} />

      {/* Content Overlay */}
      <View style={styles.content}>
        <Text style={styles.mealName}>{meal.name}</Text>

        {meal.caption && <Text style={styles.caption}>{meal.caption}</Text>}

        <Text style={styles.macros}>
          {meal.calories} cal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
        </Text>

        <Text style={styles.timestamp}>{formatDate(meal.createdAt)}</Text>

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
  mealName: {
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
