import AchievementReelsCard from '@/components/AchievementReelsCard';
import { getAchievements, Achievement } from '@/storage/achievements';
import { colors } from '@/styles/global';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, ViewToken } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const loadAchievements = async () => {
    const data = await getAchievements();
    setAchievements(data);
    console.log('Loaded achievements:', data);
  };

  useFocusEffect(
    useCallback(() => {
      loadAchievements();
    }, []),
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  if (achievements.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🎉</Text>
        <Text style={styles.emptyTitle}>No achievements yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your first achievement to get started
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={achievements}
        renderItem={({ item, index }) => (
          <AchievementReelsCard
            achievement={item}
            isActive={index === activeIndex}
            onDelete={loadAchievements}
          />
        )}
        estimatedItemSize={SCREEN_HEIGHT}
        pagingEnabled
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment='start'
        decelerationRate='fast'
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
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
    backgroundColor: colors.background,
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
});