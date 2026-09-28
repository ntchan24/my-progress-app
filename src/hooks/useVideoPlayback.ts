import { VideoPlayer, useVideoPlayer } from 'expo-video';
import { useEffect, useRef } from 'react';

export function useVideoPlayback(
  videoUri: string | undefined,
  isActive: boolean,
) {
  const player = useVideoPlayer(videoUri || '', (player) => {
    player.loop = true;
    player.muted = false;
  });

  const prevIsActive = useRef(isActive);

  useEffect(() => {
    if (!videoUri) return;

    if (isActive && !prevIsActive.current) {
      player.play();
    } else if (!isActive && prevIsActive.current) {
      player.pause();
    }

    prevIsActive.current = isActive;
  }, [isActive, player, videoUri]);

  useEffect(() => {
    return () => {
      player.pause();
    };
  }, [player]);

  return player;
}
