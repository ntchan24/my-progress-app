import { db } from './db';
import { deleteAllMediaFiles, deleteMediaFile, getMediaUri, saveMediaFile } from './mediaFiles';

export type MediaItem = {
  uri: string;
  type: 'image' | 'video';
};

export type Achievement = {
  id: string;
  // Optional so quick adds can be media-only
  name?: string;
  caption?: string;
  createdAt: string;
  // Undefined until the achievement has been shown in the feed
  lastSeenAt?: string;
  media?: MediaItem[];
};

type AchievementRow = {
  id: string;
  name: string | null;
  caption: string | null;
  created_at: string;
  last_seen_at: string | null;
};

type MediaRow = {
  achievement_id: string;
  file_name: string;
  type: 'image' | 'video';
};

export const getAchievements = async (): Promise<Achievement[]> => {
  const rows = await db.getAllAsync<AchievementRow>(
    'SELECT id, name, caption, created_at, last_seen_at FROM achievements ORDER BY created_at DESC',
  );
  const mediaRows = await db.getAllAsync<MediaRow>(
    'SELECT achievement_id, file_name, type FROM achievement_media ORDER BY achievement_id, position',
  );

  // Group media by achievement and turn stored file names back into usable URIs
  const mediaByAchievement = new Map<string, MediaItem[]>();
  for (const row of mediaRows) {
    const list = mediaByAchievement.get(row.achievement_id) ?? [];
    list.push({ uri: getMediaUri(row.file_name), type: row.type });
    mediaByAchievement.set(row.achievement_id, list);
  }

  return rows.map((row) => ({
    id: row.id,
    name: row.name ?? undefined,
    caption: row.caption ?? undefined,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at ?? undefined,
    media: mediaByAchievement.get(row.id),
  }));
};

export const markAchievementSeen = async (id: string): Promise<void> => {
  await db.runAsync(
    'UPDATE achievements SET last_seen_at = ? WHERE id = ?',
    new Date().toISOString(),
    id,
  );
};

export const addAchievement = async (
  achievement: Omit<Achievement, 'id' | 'createdAt'>,
): Promise<Achievement> => {
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();

  // Copy media out of the picker's temporary cache into permanent storage
  const savedFiles: { fileName: string; type: MediaItem['type'] }[] = [];
  try {
    for (const item of achievement.media ?? []) {
      savedFiles.push({ fileName: await saveMediaFile(item.uri), type: item.type });
    }

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'INSERT INTO achievements (id, name, caption, created_at) VALUES (?, ?, ?, ?)',
        id,
        achievement.name ?? null,
        achievement.caption ?? null,
        createdAt,
      );
      for (const [position, file] of savedFiles.entries()) {
        await db.runAsync(
          'INSERT INTO achievement_media (achievement_id, file_name, type, position) VALUES (?, ?, ?, ?)',
          id,
          file.fileName,
          file.type,
          position,
        );
      }
    });
  } catch (error) {
    // Don't leave orphaned files behind if saving failed
    savedFiles.forEach((file) => deleteMediaFile(file.fileName));
    throw error;
  }

  return {
    id,
    name: achievement.name,
    caption: achievement.caption,
    createdAt,
    media: savedFiles.map((file) => ({ uri: getMediaUri(file.fileName), type: file.type })),
  };
};

export const deleteAchievement = async (id: string): Promise<void> => {
  const mediaRows = await db.getAllAsync<{ file_name: string }>(
    'SELECT file_name FROM achievement_media WHERE achievement_id = ?',
    id,
  );
  // Media rows are removed automatically via ON DELETE CASCADE
  await db.runAsync('DELETE FROM achievements WHERE id = ?', id);
  mediaRows.forEach((row) => deleteMediaFile(row.file_name));
};

export const clearAllAchievements = async (): Promise<void> => {
  await db.runAsync('DELETE FROM achievements');
  deleteAllMediaFiles();
};
