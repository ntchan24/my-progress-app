import AsyncStorage from '@react-native-async-storage/async-storage';

export type MediaItem = {
  uri: string;
  type: 'image' | 'video';
};

export type Achievement = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
  media?: MediaItem[];
  caption?: string;
  // Deprecated fields for backward compatibility
  mediaUri?: string;
  mediaType?: 'image' | 'video';
};

const ACHIEVEMENTS_KEY = 'achievements';

export const getAchievements = async (): Promise<Achievement[]> => {
  const data = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
  const achievements: Achievement[] = data ? JSON.parse(data) : [];

  // Migrate old format to new format
  return achievements.map(achievement => {
    if (achievement.mediaUri && achievement.mediaType && !achievement.media) {
      return {
        ...achievement,
        media: [{ uri: achievement.mediaUri, type: achievement.mediaType }],
      };
    }
    return achievement;
  });
};

export const addAchievement = async (
  achievement: Omit<Achievement, 'id' | 'createdAt'>,
): Promise<Achievement> => {
  const achievements = await getAchievements();
  const newAchievement: Achievement = {
    ...achievement,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify([newAchievement, ...achievements]));
  return newAchievement;
};

export const deleteAchievement = async (id: string): Promise<void> => {
  const achievements = await getAchievements();
  const filtered = achievements.filter((achievement) => achievement.id !== id);
  await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(filtered));
};

export const clearAllAchievements = async (): Promise<void> => {
  await AsyncStorage.removeItem(ACHIEVEMENTS_KEY);
};
