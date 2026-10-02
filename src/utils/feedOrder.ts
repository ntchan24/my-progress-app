import { Achievement } from '@/storage/achievements';

// Fisher–Yates shuffle that returns a new array
const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Expects achievements newest-first (as returned by getAchievements).
// Order: latest achievement, then never-seen ones shuffled, then seen ones (longest ago first).
export const orderFeed = (achievements: Achievement[]): Achievement[] => {
  if (achievements.length === 0) return [];

  const [latest, ...rest] = achievements;
  const unseen = shuffle(rest.filter((achievement) => !achievement.lastSeenAt));
  const seen = rest
    .filter((achievement) => achievement.lastSeenAt)
    .sort((a, b) => (a.lastSeenAt ?? '').localeCompare(b.lastSeenAt ?? ''));

  return [latest, ...unseen, ...seen];
};

// The same achievement can appear in several rounds, so each copy needs its own key
export type FeedItem = { key: string; achievement: Achievement };

export const toFeedItems = (achievements: Achievement[], round: number): FeedItem[] =>
  achievements.map((achievement) => ({ key: `${achievement.id}-${round}`, achievement }));

// Order for every round after the first: a fresh shuffle that never starts
// with the post that ended the previous round
export const nextRound = (achievements: Achievement[], previousLastId?: string): Achievement[] => {
  const round = shuffle(achievements);
  if (round.length >= 2 && round[0].id === previousLastId) {
    [round[0], round[1]] = [round[1], round[0]];
  }
  return round;
};
