import MealReelsCard from '@/components/MealReelsCard';
import { getMeals, Meal } from '@/storage/meals';
import { colors } from '@/styles/global';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, ViewToken } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AllMealsScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const loadMeals = async () => {
    const data = await getMeals();
    setMeals(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
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

  if (meals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🍽️</Text>
        <Text style={styles.emptyTitle}>No meals yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your first meal to get started
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={meals}
        renderItem={({ item, index }) => (
          <MealReelsCard
            meal={item}
            isActive={index === activeIndex}
            onDelete={loadMeals}
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