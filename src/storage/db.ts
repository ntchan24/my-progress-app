import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { mediaFileExists, saveMediaFile } from './mediaFiles';

export const db = SQLite.openDatabaseSync('achievements.db');

const LEGACY_ACHIEVEMENTS_KEY = 'achievements';

// Shape of achievements saved by the old AsyncStorage version of the app
type LegacyAchievement = {
  id: string;
  name?: string;
  caption?: string;
  createdAt: string;
  media?: { uri: string; type: 'image' | 'video' }[];
  mediaUri?: string;
  mediaType?: 'image' | 'video';
};

export const initDatabase = async () => {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = result?.user_version ?? 0;

  if (version < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        caption TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS achievement_media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
        file_name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('image', 'video')),
        position INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_media_achievement ON achievement_media(achievement_id);
      PRAGMA user_version = 1;
    `);
  }

  if (version < 2) {
    // Tracks when each achievement was last shown, so the feed can surface ones not seen in a while
    await db.execAsync(`
      ALTER TABLE achievements ADD COLUMN last_seen_at TEXT;
      PRAGMA user_version = 2;
    `);
  }

  await migrateFromAsyncStorage();
};

// One-time move of achievements from AsyncStorage into SQLite.
// The old key is removed afterwards, so this only runs once.
const migrateFromAsyncStorage = async () => {
  const data = await AsyncStorage.getItem(LEGACY_ACHIEVEMENTS_KEY);
  if (!data) return;

  const legacyAchievements: LegacyAchievement[] = JSON.parse(data);

  // Copy files first (outside the transaction); skip any the OS has already cleared
  const prepared: {
    achievement: LegacyAchievement;
    savedMedia: { fileName: string; type: 'image' | 'video' }[];
  }[] = [];
  for (const achievement of legacyAchievements) {
    const media =
      achievement.media ??
      (achievement.mediaUri && achievement.mediaType
        ? [{ uri: achievement.mediaUri, type: achievement.mediaType }]
        : []);

    const savedMedia = [];
    for (const item of media) {
      if (!mediaFileExists(item.uri)) continue;
      try {
        savedMedia.push({ fileName: await saveMediaFile(item.uri), type: item.type });
      } catch (error) {
        console.warn('Skipping media that could not be copied:', item.uri, error);
      }
    }
    prepared.push({ achievement, savedMedia });
  }

  await db.withTransactionAsync(async () => {
    for (const { achievement, savedMedia } of prepared) {
      await db.runAsync(
        'INSERT OR IGNORE INTO achievements (id, name, caption, created_at) VALUES (?, ?, ?, ?)',
        achievement.id,
        achievement.name ?? null,
        achievement.caption ?? null,
        achievement.createdAt,
      );
      for (const [position, item] of savedMedia.entries()) {
        await db.runAsync(
          'INSERT INTO achievement_media (achievement_id, file_name, type, position) VALUES (?, ?, ?, ?)',
          achievement.id,
          item.fileName,
          item.type,
          position,
        );
      }
    }
  });

  await AsyncStorage.removeItem(LEGACY_ACHIEVEMENTS_KEY);
};
