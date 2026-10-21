import AchievementReelsCard from '@/components/AchievementReelsCard';
import {
  Achievement,
  addAchievement,
  deleteAchievement,
  getAchievements,
  markAchievementSeen,
} from '@/storage/achievements';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/colors';
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
  Pressable,
  Text,
  View,
  ViewToken,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);
  // Source list from the database
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  // Stops the empty state flashing on launch before the database has responded
  const [hasLoaded, setHasLoaded] = useState(false);
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
    setHasLoaded(true);
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
    <Pressable
      className='fab'
      onPress={handleQuickAdd}
      accessibilityLabel='Quick add photo or video'
    >
      <Ionicons name='camera-outline' size={24} color={colors.onInverse} />
    </Pressable>
  );

  // TEMP (dev only): sends you back through onboarding. Remove when done testing it.
  const devResetButton = __DEV__ ? (
    <Pressable className='chip absolute top-[60px] right-4 active:opacity-70' onPress={resetOnboarding}>
      <Text className='chip__label'>Reset Onboarding</Text>
    </Pressable>
  ) : null;

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

  if (!hasLoaded) {
    return <View className='flex-1 bg-bg' />;
  }

  if (achievements.length === 0) {
    return (
      <View className='flex-1 bg-bg'>
        <View className='empty-state'>
          <View className='empty-state__icon'>
            <Ionicons name='trophy-outline' size={24} color={colors.textPrimary} />
          </View>
          <Text className='empty-state__title'>your wins will live here.</Text>
          <Text className='empty-state__subtitle'>
            Add your first win and it&apos;ll show up here.
          </Text>
        </View>
        {quickAddButton}
        {devResetButton}
      </View>
    );
  }

  return (
    <View className='flex-1 bg-bg'>
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
      {devResetButton}
    </View>
  );
}
