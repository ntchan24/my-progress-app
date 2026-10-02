import AchievementReelsCard from '@/components/AchievementReelsCard';
import { addAchievement, deleteAchievement, getAchievements, Achievement } from '@/storage/achievements';
import { colors } from '@/styles/global';
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
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const loadAchievements = async () => {
    const data = await getAchievements();
    setAchievements(data);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    console.log('Loaded achievements:', data);
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
    await loadAchievements();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAchievement(id);
      // Update local state instead of reloading so the feed doesn't jump back to the top
      setAchievements((prev) => prev.filter((achievement) => achievement.id !== id));
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
        data={achievements}
        renderItem={({ item, index }) => (
          <AchievementReelsCard
            achievement={item}
            isActive={index === activeIndex && isFocused}
            onDelete={handleDelete}
          />
        )}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
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