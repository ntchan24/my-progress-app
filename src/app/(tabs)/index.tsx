import AchievementReelsCard from '@/components/AchievementReelsCard';
import {
  addAchievement,
  deleteAchievement,
  getAchievements,
  markAchievementSeen,
  Achievement,
} from '@/storage/achievements';
import { colors } from '@/styles/global';
import { FeedItem, nextRound, orderFeed, toFeedItems } from '@/utils/feedOrder';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  // Source list from the database
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  // What the list renders: the first round, followed by reshuffled rounds as the user scrolls
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const flatListRef = useRef<FlatList<FeedItem>>(null);
  // Newest achievement id at the last rebuild; undefined means the feed hasn't loaded yet
  const latestIdRef = useRef<string | null | undefined>(undefined);
  const roundRef = useRef(0);

  // Only reorder on first load or when a new achievement has been added,
  // so switching tabs keeps the current order and scroll position
  const loadAchievements = useCallback(async ({ force = false } = {}) => {
    const data = await getAchievements();
    const latestId = data[0]?.id ?? null;
    if (!force && latestId === latestIdRef.current) return;

    latestIdRef.current = latestId;
    roundRef.current = 0;
    setAchievements(data);
    setFeed(toFeedItems(orderFeed(data), 0));
    setActiveIndex(0);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  // Add another reshuffled round before the user reaches the end, so the feed loops forever
  const appendRound = () => {
    if (achievements.length < 2 || feed.length === 0) return;

    roundRef.current += 1;
    const previousLastId = feed[feed.length - 1].achievement.id;
    const round = toFeedItems(nextRound(achievements, previousLastId), roundRef.current);
    setFeed((prev) => [...prev, ...round]);
  };

  const handleQuickAdd = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Camera Permission Required',
        'Please allow camera access to take photos and videos.',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
      videoMaxDuration: 60,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    await addAchievement({
      media: [{ uri: asset.uri, type: asset.type === 'video' ? 'video' : 'image' }],
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await loadAchievements({ force: true });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAchievement(id);
      // Update local state instead of reloading so the feed doesn't jump back to the top
      const remaining = achievements.filter((achievement) => achievement.id !== id);
      setAchievements(remaining);
      // Remove every copy of the post; with fewer than 2 left there's nothing to loop
      setFeed((prev) =>
        remaining.length < 2
          ? toFeedItems(remaining, 0)
          : prev.filter((item) => item.achievement.id !== id),
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Failed to delete achievement:', error);
      Alert.alert('Something went wrong', "We couldn't delete that just now. Please try again.");
    }
  };

  const quickAddButton = (
    <TouchableOpacity
      style={styles.quickAddButton}
      onPress={handleQuickAdd}
      accessibilityLabel='Quick add photo or video'
    >
      <Ionicons name='camera' size={28} color={colors.background} />
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      loadAchievements();
      setIsFocused(true);

      return () => {
        setIsFocused(false);
      };
    }, [loadAchievements]),
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
        const item: FeedItem = viewableItems[0].item;
        markAchievementSeen(item.achievement.id).catch((error) =>
          console.warn('Failed to mark achievement as seen:', error),
        );
      }
    },
    [],
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  if (achievements.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>No achievements yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first achievement to get started
          </Text>
        </View>
        {quickAddButton}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={feed}
        renderItem={({ item, index }) => (
          <AchievementReelsCard
            achievement={item.achievement}
            isActive={index === activeIndex && isFocused}
            onDelete={handleDelete}
          />
        )}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        keyExtractor={(item) => item.key}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={appendRound}
        onEndReachedThreshold={2}
      />
      {quickAddButton}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickAddButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});